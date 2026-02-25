using System.ComponentModel.DataAnnotations.Schema;

namespace E_CommerceApi.Models
{
    public class Item
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal Price { get; set; }
        public int Quantity { get; set; } 
        public string? ImageUrl { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal? DiscountPrice { get; set; } 
        public bool IsAvailable { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public List<Review> Reviews { get; set; } = new List<Review>();
        public int CategoryId { get; set; }
        [ForeignKey("CategoryId")]
        public Category Category { get; set; }
    }
}
