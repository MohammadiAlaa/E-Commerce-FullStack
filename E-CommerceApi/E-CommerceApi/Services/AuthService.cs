using E_CommerceApi.DTOs;
using E_CommerceApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace E_CommerceApi.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IMailService _mailService;
        private readonly IConfiguration _configuration;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            IMailService mailService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _mailService = mailService;
        }

        public async Task<AuthModel> RegisterAsync(RegisterDto model)
        {
            if (await _userManager.FindByEmailAsync(model.Email) is not null)
                return new AuthModel { Massege = "Email is already registered!" };

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FullName = model.FullName, 
                Address = model.Address
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
                return new AuthModel { Massege = string.Join(", ", result.Errors.Select(e => e.Description)) };

            await _userManager.AddToRoleAsync(user, "User");

            return await CreateTokenAsync(user);
        }

        public async Task<AuthModel> GetTokenAsync(LoginDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user is null || !await _userManager.CheckPasswordAsync(user, model.Password))
                return new AuthModel { Massege = "Invalid Email or Password" };

            return await CreateTokenAsync(user);
        }

        public async Task<string> AddRoleAsync(AddRoleModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user is null)
                return "User not found";

            if (!await _roleManager.RoleExistsAsync(model.RoleName))
                return "Role not found";

            if (await _userManager.IsInRoleAsync(user, model.RoleName))
                return "User already assigned to this role";

            var result = await _userManager.AddToRoleAsync(user, model.RoleName);
            return result.Succeeded ? string.Empty : "Error adding role";
        }

        public async Task<string> ForgotPasswordAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) 
                return "User not found";

            var otp = new Random().Next(100000, 999999).ToString();

            user.OTP = otp;
            user.OTPExpiration = DateTime.UtcNow.AddMinutes(10);

            await _userManager.UpdateAsync(user);

            var message = $@"
            <div style='font-family: Arial; border: 1px solid #ddd; padding: 20px;'>
                <h2 style='color: #4CAF50;'> Welcome to Our Store </h2>
                <p>Your OTP for password reset is: <b>{otp}</b></p>
                <p>This code will expire in 10 minutes.</p>
            </div>";

            await _mailService.SendEmailAsync(user.Email, "Reset Your Password", message);

            return string.Empty; 
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _userManager.Users.ToListAsync();
            var userList = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userList.Add(new UserDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    Roles = roles.ToList(),
                    IsBlocked = user.LockoutEnd > DateTime.Now 
                });
            }
            return userList;
        }

        public async Task<string> ToggleBlockUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return "User not found";

            if (user.LockoutEnd > DateTime.Now)
                await _userManager.SetLockoutEndDateAsync(user, null);
            else
                await _userManager.SetLockoutEndDateAsync(user, DateTime.UtcNow.AddYears(100));

            return string.Empty;
        }
        public async Task<string> ResetPasswordAsync(ResetPasswordDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) 
                return "User not found";

            if (user.OTP != model.OTP || user.OTPExpiration < DateTime.UtcNow)
                return "Invalid or expired OTP";

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, model.NewPassword);

            if (result.Succeeded)
            {
                user.OTP = null; 
                user.OTPExpiration = null;
                await _userManager.UpdateAsync(user);
                return string.Empty;
            }

            return "Error resetting password";
        }

        public async Task<string> DeleteProfileAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return "User not found";

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded) 
                return "Error deleting profile";

            return string.Empty; 
        }


        private async Task<AuthModel> CreateTokenAsync(ApplicationUser user)
        {
            var userRoles = await _userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            foreach (var role in userRoles)
                authClaims.Add(new Claim(ClaimTypes.Role, role));

            var authKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]));
            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                expires: DateTime.Now.AddDays(double.Parse(_configuration["JWT:DurationInDays"])),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authKey, SecurityAlgorithms.HmacSha256)
            );

            return new AuthModel
            {
                IsAuthenticated = true,
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Email = user.Email,
                Username = user.UserName,
                Roles = userRoles.ToList(),
                ExpiresOn = token.ValidTo
            };
        }
    }
}