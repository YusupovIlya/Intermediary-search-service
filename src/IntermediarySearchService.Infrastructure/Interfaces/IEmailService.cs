
using IntermediarySearchService.Infrastructure.Models;

namespace IntermediarySearchService.Infrastructure.Interfaces;

public interface IEmailService
{
    public MailData PrepareConfirmationMail(string firstName, string lastName, string token,
                                            string email, string userId);

    Task<bool> SendAsync(MailData mailData);
}
