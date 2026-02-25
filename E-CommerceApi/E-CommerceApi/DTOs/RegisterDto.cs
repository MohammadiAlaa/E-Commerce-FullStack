using System.ComponentModel.DataAnnotations;

namespace E_CommerceApi.DTOs
{
    public class RegisterDto
    {
        [Required, StringLength(100)]
        public string? FullName { get; set; } 

        [Required, EmailAddress]
        public string? Email { get; set; }

        [Required, StringLength(100, MinimumLength = 6)]
        public string? Password { get; set; }

        [Required]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string? ConfirmPassword { get; set; } 

        public string? Address { get; set; }
    }
}
