using IntermediarySearchService.Core.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;

namespace IntermediarySearchService.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public ApplicationUser(string firstName, string lastName, string email)
                           : base(email)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
    }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string? Country { get; set; }

    private readonly List<Address> _addresses = new List<Address>();
    public IReadOnlyCollection<Address> Addresses => _addresses.AsReadOnly();

    public void AddAddress(Address address)
    {
        _addresses.Add(address);
    }
    public void DeleteAddress(Address address)
    {
        var item = _addresses.FirstOrDefault(a => a.Label == address.Label);
        _addresses.Remove(item);
    }
}
