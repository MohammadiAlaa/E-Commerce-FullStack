using System.ComponentModel.DataAnnotations;

namespace E_CommerceApi.DTOs
{
    public class UpdateItemDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public decimal? DiscountPrice { get; set; } 
        public int? Quantity { get; set; }
        public int? CategoryId { get; set; }
        public IFormFile? ImageFile { get; set; }
    }
}
