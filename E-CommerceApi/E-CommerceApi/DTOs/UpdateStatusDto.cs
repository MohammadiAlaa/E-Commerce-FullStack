using System.ComponentModel.DataAnnotations;

namespace E_CommerceApi.DTOs
{
    public class UpdateStatusDto
    {
        [Required]
        [RegularExpression("Pending|Processing|Shipped|OutForDelivery|Delivered|Cancelled|Completed", ErrorMessage = "Invalid Status")]
        public string Status { get; set; }

        public string? Reason { get; set; }
    }
}
