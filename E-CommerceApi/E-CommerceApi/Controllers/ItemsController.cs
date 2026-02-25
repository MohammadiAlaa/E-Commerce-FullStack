using E_CommerceApi.DTOs;
using E_CommerceApi.Models;
using E_CommerceApi.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace E_CommerceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IWebHostEnvironment _env;

        public ItemsController(IUnitOfWork unitOfWork, IWebHostEnvironment env)
        {
            _unitOfWork = unitOfWork;
            _env = env;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll([FromQuery] int? categoryId)
        {
            var items = await _unitOfWork.Repository<Item>().FindAllAsync(
                x => !categoryId.HasValue || x.CategoryId == categoryId, new[] { "Category" }
            );

            var result = items.Select(i => new {
                i.Id,
                i.Name,
                i.Description,
                i.Price,
                i.DiscountPrice,
                i.ImageUrl,
                i.Quantity,
                i.CategoryId,
                CategoryName = i.Category?.Name 
            });

            return Ok(result);
        }


        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _unitOfWork.Repository<Item>().FindAsync(x => x.Id == id, new[] { "Category" });
            if (item == null) 
                return NotFound(new { message = "Item not found" });
            return Ok(item);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromForm] CreateItemDto itemDto)
        {
            if (!ModelState.IsValid) 
                return BadRequest(ModelState);  

            string? imageUrl = null;

            if (itemDto.ImageFile != null)
            {
                imageUrl = await SaveImage(itemDto.ImageFile);
            }

            var item = new Item
            {
                Name = itemDto.Name,
                Description = itemDto.Description,
                Price = itemDto.Price,
                DiscountPrice = itemDto.DiscountPrice, 
                Quantity = itemDto.Quantity,
                ImageUrl = imageUrl,
                CategoryId = itemDto.CategoryId,
                CreatedAt = DateTime.Now,
                IsAvailable = true
            };

            await _unitOfWork.Repository<Item>().AddAsync(item);
            await _unitOfWork.CompleteAsync();

            return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateItemDto itemDto)
        {
            var existingItem = await _unitOfWork.Repository<Item>().GetByIdAsync(id);
            if (existingItem == null) return NotFound($"Item not found.");

            if (itemDto.ImageFile != null)
            {
                DeleteImage(existingItem.ImageUrl);
                existingItem.ImageUrl = await SaveImage(itemDto.ImageFile);
            }

            existingItem.Name = itemDto.Name ?? existingItem.Name;
            existingItem.Description = itemDto.Description ?? existingItem.Description;
            existingItem.Price = itemDto.Price ?? existingItem.Price;
            existingItem.DiscountPrice = itemDto.DiscountPrice ?? existingItem.DiscountPrice; 
            existingItem.Quantity = itemDto.Quantity ?? existingItem.Quantity;
            existingItem.CategoryId = itemDto.CategoryId ?? existingItem.CategoryId;

            _unitOfWork.Repository<Item>().Update(existingItem);
            await _unitOfWork.CompleteAsync();

            return Ok(existingItem);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _unitOfWork.Repository<Item>().GetByIdAsync(id);

            if (item == null) 
                return NotFound();

            DeleteImage(item.ImageUrl);

            _unitOfWork.Repository<Item>().Delete(item);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }


        private async Task<string> SaveImage(IFormFile file)
        {
            string uploadsFolder = Path.Combine(_env.WebRootPath, "images");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return $"/images/{uniqueFileName}";
        }

        private void DeleteImage(string? imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl)) 
                return;

            var filePath = Path.Combine(_env.WebRootPath, imageUrl.TrimStart('/'));
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }
    }
}