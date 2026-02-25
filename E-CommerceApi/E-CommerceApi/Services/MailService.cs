using E_CommerceApi.Services;
using System.Net;
using System.Net.Mail;

public class MailService : IMailService
{
    private readonly IConfiguration _config;
    public MailService(IConfiguration config) => _config = config;

    public async Task SendEmailAsync(string mailTo, string subject, string body)
    {
        var smtpClient = new SmtpClient(_config["MailSettings:Host"])
        {
            Port = int.Parse(_config["MailSettings:Port"]),
            Credentials = new NetworkCredential(_config["MailSettings:Mail"], _config["MailSettings:Password"]),
            EnableSsl = true,
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(_config["MailSettings:Mail"], _config["MailSettings:DisplayName"]),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };
        mailMessage.To.Add(mailTo);

        await smtpClient.SendMailAsync(mailMessage);
    }
}