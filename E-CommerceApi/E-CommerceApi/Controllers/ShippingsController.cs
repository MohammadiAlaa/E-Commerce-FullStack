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
    [Authorize(Roles = "Admin,Driver")]
    public class ShippingsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public ShippingsController(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

        [HttpGet("All")]
        public async Task<IActionResult> GetAllShippings()
        {
            var shippings = await _unitOfWork.Repository<Shipping>()
                .GetAllAsync(include: "Order");

            var result = shippings.Select(s => new ShippingFullDetailsDto
            {
                Id = s.Id,
                Address = s.Address,
                City = s.City,
                ReceiverPhoneNumber = s.ReceiverPhoneNumber,
                Status = s.Status,
                CancelReason = s.CancelReason,
                OrderId = s.OrderId,
                DriverId = s.DriverId,
                DriverName = s.Driver != null ? s.Driver.FullName : "Not Assigned"
            }).ToList();

            return Ok(result);
        }

        [HttpGet("MyTasks")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> GetMyTasks()
        {
            var currentDriverId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var tasks = await _unitOfWork.Repository<Shipping>()
                .FindAllAsync(s => s.DriverId == currentDriverId && s.Status != "Delivered", new[] { "Order" });
            return Ok(tasks);
        }

        [HttpPatch("{id}/Status")]
        [Authorize(Roles = "Admin,Driver")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");

            var shipping = await _unitOfWork.Repository<Shipping>()
                .FindAsync(s => s.Id == id && (isAdmin || s.DriverId == userId), new[] { "Order.Payment" });

            if (shipping == null) 
                return NotFound(new { message = "Shipping task not found or unauthorized." });

            using var transaction = await _unitOfWork.BeginTransactionAsync();
            try
            {
                shipping.Status = dto.Status;
                shipping.LastUpdated = DateTime.Now;
                if (dto.Status == "Cancelled") shipping.CancelReason = dto.Reason;

                if (shipping.Order != null)
                {
                    shipping.Order.Status = (dto.Status == "Delivered") ? "Completed" : dto.Status;

                    if (dto.Status == "Delivered" && shipping.Order.Payment != null)
                    {
                        shipping.Order.Payment.Status = "Completed";
                        shipping.Order.Payment.PaymentDate = DateTime.Now;
                    }
                }

                _unitOfWork.Repository<Shipping>().Update(shipping);
                await _unitOfWork.CompleteAsync();
                await transaction.CommitAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Internal server error during status update.");
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpPost("{id}/AssignDriver/{driverId}")]
        public async Task<IActionResult> AssignDriver(int id, string driverId)
        {
            var shipping = await _unitOfWork.Repository<Shipping>().GetByIdAsync(id);
            if (shipping == null) return NotFound();

            shipping.DriverId = driverId;
            shipping.Status = "Processing"; 
            _unitOfWork.Repository<Shipping>().Update(shipping);
            await _unitOfWork.CompleteAsync();
            return Ok(new { message = "Driver assigned successfully" });
        }
    }
}