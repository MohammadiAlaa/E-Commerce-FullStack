using System.ComponentModel.DataAnnotations.Schema;

namespace E_CommerceApi.Models
{
    public class Order
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public string Status { get; set; } = "Pending"; 

        [Column(TypeName = "decimal(18, 2)")]
        public decimal TotalAmount { get; set; }

        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }

        public Shipping Shipping { get; set; } 
        public Payment Payment { get; set; }   
        public List<OrderItem> OrderItems { get; set; }
    }
}
