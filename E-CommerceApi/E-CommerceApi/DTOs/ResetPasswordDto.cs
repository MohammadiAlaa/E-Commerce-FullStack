using System.ComponentModel.DataAnnotations;

namespace E_CommerceApi.DTOs
{
    public class ResetPasswordDto
    {
        [Required, EmailAddress]
        public string? Email { get; set; }
        [Required]
        public string? OTP { get; set; } 
        [Required, MinLength(6)]
        public string? NewPassword { get; set; }
    }
}
