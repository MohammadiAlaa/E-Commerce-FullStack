using E_CommerceApi.Models;
using E_CommerceApi.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_CommerceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public DashboardController(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

        [HttpGet("Stats")]
        public async Task<IActionResult> GetStats()
        {
            var ordersQuery = _unitOfWork.Repository<Order>().GetTableNoTracking();

            var totalRevenue = await ordersQuery
                .Where(o => o.Status == "Completed" || o.Status == "Delivered")
                .SumAsync(o => (decimal?)o.TotalAmount) ?? 0;

            var activeOrdersCount = await ordersQuery
                .Where(o => o.Status != "Delivered" &&
                            o.Status != "Completed" &&
                            o.Status != "Cancelled")
                .CountAsync();

            var cancelledCount = await ordersQuery
                .Where(o => o.Status == "Cancelled")
                .CountAsync();

            var lowStockItems = await _unitOfWork.Repository<Item>()
                .GetTableNoTracking()
                .Where(i => i.Quantity < 5)
                .Select(i => new { name = i.Name, quantity = i.Quantity })
                .ToListAsync();

            return Ok(new
            {
                totalRevenue = totalRevenue,
                totalOrders = activeOrdersCount, 
                cancelledOrdersCount = cancelledCount,
                lowStockCount = lowStockItems.Count,
                lowStockItems = lowStockItems
            });
        }

        [HttpGet("TopSellingProducts")]
        public async Task<IActionResult> GetTopSelling()
        {
            var topProducts = await _unitOfWork.Repository<OrderItem>()
                .GetTableNoTracking()
                .GroupBy(oi => new { oi.ItemId, oi.Item.Name })
                .Select(g => new
                {
                    ProductName = g.Key.Name,
                    TotalSold = g.Sum(oi => oi.Quantity),
                    TotalRevenue = g.Sum(oi => oi.Quantity * oi.PriceAtPurchase)
                })
                .OrderByDescending(p => p.TotalSold)
                .Take(5)
                .ToListAsync();

            return Ok(topProducts);
        }
    }
}