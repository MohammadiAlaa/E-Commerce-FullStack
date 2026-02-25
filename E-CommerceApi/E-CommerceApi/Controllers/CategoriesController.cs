using E_CommerceApi.DTOs;
using E_CommerceApi.Models;
using E_CommerceApi.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace E_CommerceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public CategoriesController(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _unitOfWork.Repository<Category>().GetAllAsync();
            var dtos = categories.Select(c => new CategoryDto { Id = c.Id, Name = c.Name });
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _unitOfWork.Repository<Category>().GetByIdAsync(id);
            if (category == null) 
                return NotFound("Category not found");

            return Ok(new CategoryDto { Id = category.Id, Name = category.Name });
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var category = new Category { Name = dto.Name };
            await _unitOfWork.Repository<Category>().AddAsync(category);
            await _unitOfWork.CompleteAsync();

            var responseDto = new CategoryDto
            {
                Id = category.Id,
                Name = category.Name
            };

            return CreatedAtAction(nameof(GetById), new { id = category.Id }, responseDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] 
        public async Task<IActionResult> Update(int id, [FromBody] CreateCategoryDto dto)
        {
            var category = await _unitOfWork.Repository<Category>().GetByIdAsync(id);

            if (category == null)
                return NotFound("Category not found");

            category.Name = dto.Name;

            _unitOfWork.Repository<Category>().Update(category);
            await _unitOfWork.CompleteAsync();

            var responseDto = new CategoryDto
            {
                Id = category.Id,
                Name = category.Name
            };

            return Ok(responseDto);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _unitOfWork.Repository<Category>().GetByIdAsync(id);
            if (category == null)
                return NotFound("Category not found");

            var hasItems = await _unitOfWork.Repository<Item>().FindAsync(i => i.CategoryId == id);
            if (hasItems != null)
                return BadRequest("Cannot delete category because it contains products.");

            _unitOfWork.Repository<Category>().Delete(category);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}