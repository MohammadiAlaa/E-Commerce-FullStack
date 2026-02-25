namespace E_CommerceApi.Services
{
    public interface IMailService
    {
        Task SendEmailAsync(string mailTo, string subject, string body);
    }
}
