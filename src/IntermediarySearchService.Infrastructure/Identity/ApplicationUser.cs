using Microsoft.AspNetCore.Identity;

namespace IntermediarySearchService.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public ApplicationUser(string userName, string firstName, 
                           string lastName, string email)
                           : base(userName)
    {
        FirstName = firstName;
        LastName = lastName;
        this.Email = email;
    }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string? Country { get; set; }
}
