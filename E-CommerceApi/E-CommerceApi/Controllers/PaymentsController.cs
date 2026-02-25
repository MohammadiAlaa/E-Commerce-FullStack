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
    public class PaymentsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public PaymentsController(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

        [HttpPost("{id}/Confirm")]
        [Authorize(Roles = "Admin,Driver")]
        public async Task<IActionResult> ConfirmPayment(int id)
        {
            var payment = await _unitOfWork.Repository<Payment>().FindAsync(p => p.Id == id, new[] { "Order.Shipping" });

            if (payment == null) 
                return NotFound(new { message = "Payment not found." });

            if (payment.Status == "Completed")
                return BadRequest(new { message = "Already confirmed." });

            payment.Status = "Completed";
            payment.PaymentDate = DateTime.Now;

            if (payment.Order != null)
            {
                payment.Order.Status = "Completed";
                if (payment.Order.Shipping != null)
                {
                    payment.Order.Shipping.Status = "Delivered";
                }
            }

            await _unitOfWork.CompleteAsync();
            return Ok(new { message = "Payment and Order completed successfully." });
        }
    }
}