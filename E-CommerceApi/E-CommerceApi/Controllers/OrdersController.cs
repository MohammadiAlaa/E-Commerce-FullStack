using E_CommerceApi.DTOs;
using E_CommerceApi.Models;
using E_CommerceApi.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace E_CommerceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public OrdersController(IUnitOfWork unitOfWork)
            => _unitOfWork = unitOfWork;

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            using var transaction = await _unitOfWork.BeginTransactionAsync();
            try
            {
                decimal totalAmount = 0;
                var orderItems = new List<OrderItem>();

                foreach (var itemDto in dto.Items)
                {
                    var product = await _unitOfWork.Repository<Item>().GetByIdAsync(itemDto.ItemId);
                    if (product == null) return BadRequest($"Item {itemDto.ItemId} not found.");
                    if (product.Quantity < itemDto.Quantity) return BadRequest($"Insufficient stock for {product.Name}.");

                    product.Quantity -= itemDto.Quantity;
                    _unitOfWork.Repository<Item>().Update(product);

                    var currentPrice = (product.DiscountPrice > 0) ? product.DiscountPrice.Value : product.Price;

                    orderItems.Add(new OrderItem
                    {
                        ItemId = itemDto.ItemId,
                        Quantity = itemDto.Quantity,
                        Price = product.Price,
                        PriceAtPurchase = currentPrice
                    });
                    totalAmount += currentPrice * itemDto.Quantity;
                }

                var order = new Order
                {
                    UserId = userId,
                    OrderDate = DateTime.Now,
                    Status = "Pending",
                    TotalAmount = totalAmount,
                    OrderItems = orderItems,
                    Shipping = new Shipping
                    {
                        Address = dto.Address,
                        City = dto.City,
                        ReceiverPhoneNumber = dto.ReceiverPhoneNumber,
                        Status = "Pending",
                        ShippingMethod = "Cash"
                    },
                    Payment = new Payment
                    {
                        Method = dto.PaymentMethod ?? "Cash",
                        Status = "Pending",
                        Amount = totalAmount
                    }
                };

                await _unitOfWork.Repository<Order>().AddAsync(order);
                await _unitOfWork.CompleteAsync();
                await transaction.CommitAsync();

                return Ok(new { orderId = order.Id, total = totalAmount });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                var innerError = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, "Detailed Error: " + innerError);
            }
        }

        [HttpPost("{id}/Cancel")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");
            var isDriver = User.IsInRole("Driver");

            var order = await _unitOfWork.Repository<Order>().FindAsync(
                o => o.Id == id,
                new[] { "OrderItems", "Shipping" }
            );

            if (order == null)
                return NotFound("Order not found");

            if (!isAdmin && !isDriver)
            {
                if (order.UserId != userId)
                    return Unauthorized();

                if (order.Status != "Pending" || order.Shipping?.Status == "OutForDelivery")
                {
                    return BadRequest("Cannot cancel order after it has been processed or out for delivery.");
                }
            }

            using var transaction = await _unitOfWork.BeginTransactionAsync();
            try
            {
                foreach (var orderItem in order.OrderItems)
                {
                    var product = await _unitOfWork.Repository<Item>().GetByIdAsync(orderItem.ItemId);
                    if (product != null)
                    {
                        product.Quantity += orderItem.Quantity;
                        _unitOfWork.Repository<Item>().Update(product);
                    }
                }

                order.Status = "Cancelled";
                if (order.Shipping != null) order.Shipping.Status = "Cancelled";

                _unitOfWork.Repository<Order>().Update(order);
                await _unitOfWork.CompleteAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Order cancelled successfully." });
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Error during cancellation.");
            }
        }

        [HttpGet("MyOrders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var orders = await _unitOfWork.Repository<Order>()
                .FindAllAsync(o => o.UserId == userId, new[] { "OrderItems.Item", "Shipping" });

            var response = orders.Select(o => MapToOrderResponse(o));

            return Ok(response);
        }

        [HttpGet("AllOrders")]
        [Authorize(Roles = "Admin,Driver")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _unitOfWork.Repository<Order>()
                .GetAllAsync("OrderItems.Item,Shipping");

            var response = orders.Select(o => MapToOrderResponse(o));

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");
            var isDriver = User.IsInRole("Driver");

            var order = await _unitOfWork.Repository<Order>().FindAsync(
                o => o.Id == id && (isAdmin || isDriver || o.UserId == userId),
                new[] { "Shipping", "OrderItems.Item" }
            );

            if (order == null)
                return NotFound();

            return Ok(MapToOrderResponse(order));
        }

        [HttpPost("{id}/Complete")]
        [Authorize(Roles = "Driver,Admin")]
        public async Task<IActionResult> CompleteOrder(int id)
        {
            var order = await _unitOfWork.Repository<Order>().FindAsync(
                o => o.Id == id,
                new[] { "Payment", "Shipping" }
            );

            if (order == null) return NotFound("Order not found");

            order.Status = "Delivered";

            if (order.Shipping != null)
            {
                order.Shipping.Status = "Delivered";
            }

            if (order.Payment != null && order.Payment.Method == "Cash")
            {
                order.Payment.Status = "Completed"; 
            }

            _unitOfWork.Repository<Order>().Update(order);
            await _unitOfWork.CompleteAsync();

            return Ok(new { message = "Order and Payment marked as completed successfully." });
        }

        private static OrderResponseDto MapToOrderResponse(Order o)
        {
            return new OrderResponseDto
            {
                Id = o.Id,
                OrderDate = o.OrderDate,
                Status = o.Status,
                TotalAmount = o.TotalAmount,
                Shipping = o.Shipping == null ? null : new ShippingResponseDto
                {
                    Address = o.Shipping.Address ?? "No Address",
                    City = o.Shipping.City ?? "No City",
                    Status = o.Shipping.Status ?? "Unknown",
                    ReceiverPhoneNumber = o.Shipping.ReceiverPhoneNumber ?? "No Phone"
                },
                Payment = o.Payment == null ? null : new PaymentResponseDto
                {
                    Method = o.Payment.Method,
                    Status = o.Payment.Status,
                    Amount = o.Payment.Amount
                },
                Items = o.OrderItems?.Select(oi => new OrderItemResponseDto
                {
                    ProductId = oi.ItemId,
                    ProductName = oi.Item?.Name ?? "Product Deleted",
                    Quantity = oi.Quantity,
                    Price = oi.PriceAtPurchase
                }).ToList() ?? new List<OrderItemResponseDto>()
            };
        }
    }
}