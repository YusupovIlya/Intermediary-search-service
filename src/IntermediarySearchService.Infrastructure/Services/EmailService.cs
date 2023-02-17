using IntermediarySearchService.Infrastructure.Interfaces;
using IntermediarySearchService.Infrastructure.Models;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using System.Web;

namespace IntermediarySearchService.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly MailSettings _settings;
    private readonly IConfiguration _configuration;

    public EmailService(IOptions<MailSettings> settings, IConfiguration configuration)
    {
        _settings = settings.Value;
        _configuration = configuration;
    }

    public MailData PrepareConfirmationMail(string firstName, string lastName, string token, 
                                            string email, string userId)
    {
        var host = _configuration.GetSection("API_URL").Value;
        string codeHtmlVersion = HttpUtility.UrlEncode(token);
        string callbackUrl = $"{host}/api/v1/auth/{userId}/?token={codeHtmlVersion}";
        var mail = new MailData(
            to: new List<string> { email },
            subject: $"Account activation on {host}",
            body: $@"
                    <div>
                        <h1>Hello, {firstName} {lastName}! To activate your account follow the link</h1>
                        <a href=""{callbackUrl}"">Activate my account</a>
                    </div>
                  "
            );
        return mail;
    }

    public async Task<bool> SendAsync(MailData mailData)
    {
        try
        {
            var mail = new MimeMessage();

            mail.From.Add(new MailboxAddress(_settings.DisplayName, mailData.From ?? _settings.From));
            mail.Sender = new MailboxAddress(mailData.DisplayName ?? _settings.DisplayName, mailData.From ?? _settings.From);

            foreach (string mailAddress in mailData.To)
                mail.To.Add(MailboxAddress.Parse(mailAddress));

            if (!string.IsNullOrEmpty(mailData.ReplyTo))
                mail.ReplyTo.Add(new MailboxAddress(mailData.ReplyToName, mailData.ReplyTo));

            if (mailData.Bcc != null)
            {
                foreach (string mailAddress in mailData.Bcc.Where(x => !string.IsNullOrWhiteSpace(x)))
                    mail.Bcc.Add(MailboxAddress.Parse(mailAddress.Trim()));
            }

            if (mailData.Cc != null)
            {
                foreach (string mailAddress in mailData.Cc.Where(x => !string.IsNullOrWhiteSpace(x)))
                    mail.Cc.Add(MailboxAddress.Parse(mailAddress.Trim()));
            }

            var body = new BodyBuilder();
            mail.Subject = mailData.Subject;
            body.HtmlBody = mailData.Body;
            mail.Body = body.ToMessageBody();

            using var smtp = new SmtpClient();

            if (_settings.UseSSL)
            {
                await smtp.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.SslOnConnect);
            }
            else if (_settings.UseStartTls)
            {
                await smtp.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.StartTls);
            }
            await smtp.AuthenticateAsync(_settings.UserName, _settings.Password);
            await smtp.SendAsync(mail);
            await smtp.DisconnectAsync(true);

            return true;

        }
        catch (Exception)
        {
            return false;
        }
    }
}
