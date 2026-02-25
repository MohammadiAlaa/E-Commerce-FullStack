using E_CommerceApi.DTOs;
using E_CommerceApi.Models;
using E_CommerceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace E_CommerceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly UserManager<ApplicationUser> _userManager;

        public AccountsController(IAuthService authService, UserManager<ApplicationUser> userManager)
        {
            _authService = authService;
            _userManager = userManager;
        }

        [HttpGet("AllUsers")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();

            var userDtos = new List<UserDto>();

            foreach (var u in users)
            {
                var roles = await _userManager.GetRolesAsync(u);

                userDtos.Add(new UserDto
                {
                    Id = u.Id,
                    FullName = u.FullName ?? "No Name",
                    Email = u.Email,
                    IsBlocked = u.IsBlocked,
                    Roles = roles.ToList() 
                });
            }

            return Ok(userDtos);
        }

        [HttpPost("ToggleBlock/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ToggleBlock(string userId)
        {
            var result = await _authService.ToggleBlockUserAsync(userId);
            if (!string.IsNullOrEmpty(result))
                return BadRequest(result);

            return Ok(new { message = "User status updated successfully" });
        }

        [HttpPost("Register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.RegisterAsync(model);

            if (!result.IsAuthenticated)
                return BadRequest(result.Massege);
            return Ok(result);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> GetTokenAsync([FromBody] LoginDto model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _authService.GetTokenAsync(model);
            if (!result.IsAuthenticated) return BadRequest(result.Massege);
            return Ok(result);
        }

        [HttpPost("AddRole")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddRoleAsync([FromBody] AddRoleModel model)
        {
            if (!ModelState.IsValid) 
                return BadRequest(ModelState);
            var result = await _authService.AddRoleAsync(model);
            if (!string.IsNullOrEmpty(result)) 
                return BadRequest(result);
            return Ok(model);
        }

        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            var result = await _authService.ForgotPasswordAsync(model.Email);
            if (!string.IsNullOrEmpty(result)) return BadRequest(result);
            return Ok(new { message = "OTP sent to your email" });
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            var result = await _authService.ResetPasswordAsync(model);
            if (!string.IsNullOrEmpty(result)) return BadRequest(result);
            return Ok(new { message = "Password reset successfully" });
        }

        [HttpDelete("DeleteProfile")]
        [Authorize] 
        public async Task<IActionResult> DeleteProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _authService.DeleteProfileAsync(userId);

            if (!string.IsNullOrEmpty(result))
                return BadRequest(result);

            return Ok(new { message = "Profile deleted successfully" });
        }
    }
}
