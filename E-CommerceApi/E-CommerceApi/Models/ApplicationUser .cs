using Microsoft.AspNetCore.Identity;

namespace E_CommerceApi.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }
        public string? Address { get; set; }
        public string? OTP { get; set; }
        public DateTime? OTPExpiration { get; set; }

        public bool IsBlocked { get; set; }

        public List<Order> Orders { get; set; } = new List<Order>();

        public List<Review> Reviews { get; set; } = new List<Review>();

    }
}
