using E_CommerceApi.DTOs;

namespace E_CommerceApi.Services
{
    public interface IAuthService
    {
        Task<AuthModel> RegisterAsync(RegisterDto model);
        Task<AuthModel> GetTokenAsync(LoginDto model);
        Task<string> AddRoleAsync(AddRoleModel model);

        Task<string> ForgotPasswordAsync(string email);
        Task<string> ResetPasswordAsync(ResetPasswordDto model);

        Task<string> DeleteProfileAsync(string userId);

        Task<IEnumerable<UserDto>> GetAllUsersAsync(); 
        Task<string> ToggleBlockUserAsync(string userId);
    }
}
