using Microsoft.AspNetCore.Identity;
using IntermediarySearchService.Core.Exceptions;

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
    public string AdditionalContact { get; set; }

    private readonly List<UserAddress> _addresses = new List<UserAddress>();
    public IReadOnlyCollection<UserAddress> Addresses => _addresses.AsReadOnly();

    public void AddAddress(UserAddress address) => _addresses.Add(address);

    /// <summary>
    /// Removes address by its id
    /// </summary>
    /// <param name="id"></param>
    /// <exception cref="AddressNotFoundException"></exception>
    public void RemoveAddress(int id)
    {
        var address = _addresses.FirstOrDefault(a => a.Id == id);
        if (address != null) _addresses.Remove(address);
        else throw new AddressNotFoundException(id, UserName);
    }
}
