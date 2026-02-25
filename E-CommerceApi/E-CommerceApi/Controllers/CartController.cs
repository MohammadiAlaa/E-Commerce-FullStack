using Microsoft.AspNetCore.Mvc;
using E_CommerceApi.Models;
using E_CommerceApi.Repositories;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using E_CommerceApi.DTOs;

namespace E_CommerceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class CartController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public CartController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var cartItems = await _unitOfWork.Repository<CartItem>()
                .FindAllAsync(c => c.UserId == userId, new[] { "Item" });

            var response = cartItems
                .Where(c => c.Item != null)
                .Select(c => new CartItemDto
                {
                    Id = c.Id,
                    ItemId = c.ItemId,
                    Quantity = c.Quantity,
                    Item = new CartProductDto 
                    {
                        Id = c.Item.Id,
                        Name = c.Item.Name,
                        Price = c.Item.Price,
                        DiscountPrice = c.Item.DiscountPrice,
                        ImageUrl = c.Item.ImageUrl
                    }
                }).ToList();

            return Ok(response);
        }

        [HttpPost("Add")]
        public async Task<IActionResult> AddToCart([FromBody] CartRequestDto request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var existingItem = await _unitOfWork.Repository<CartItem>()
                .FindAsync(c => c.UserId == userId && c.ItemId == request.ItemId);

            if (existingItem != null)
            {
                existingItem.Quantity += request.Quantity;
                _unitOfWork.Repository<CartItem>().Update(existingItem);
            }
            else
            {
                var newItem = new CartItem
                {
                    UserId = userId,
                    ItemId = request.ItemId,
                    Quantity = request.Quantity
                };
                await _unitOfWork.Repository<CartItem>().AddAsync(newItem);
            }

            await _unitOfWork.CompleteAsync();
            return Ok(new { message = "Product added to cart successfully" });
        }

        [HttpDelete("Remove/{itemId}")]
        public async Task<IActionResult> RemoveFromCart(int itemId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var item = await _unitOfWork.Repository<CartItem>()
                .FindAsync(c => c.UserId == userId && c.ItemId == itemId);

            if (item == null) return NotFound("Product not found in your cart");

            _unitOfWork.Repository<CartItem>().Delete(item);
            await _unitOfWork.CompleteAsync();

            return Ok(new { message = "Product removed from cart" });
        }

        [HttpDelete("Clear")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var cartItems = await _unitOfWork.Repository<CartItem>()
                .FindAllAsync(c => c.UserId == userId);

            foreach (var item in cartItems)
            {
                _unitOfWork.Repository<CartItem>().Delete(item);
            }

            await _unitOfWork.CompleteAsync();
            return Ok(new { message = "Cart cleared successfully" });
        }
    }
}
