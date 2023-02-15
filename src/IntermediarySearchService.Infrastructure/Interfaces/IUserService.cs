using IntermediarySearchService.Infrastructure.Identity;
using IntermediarySearchService.Core.Exceptions;

namespace IntermediarySearchService.Infrastructure.Interfaces;

public interface IUserService
{
    /// <summary>
    /// Gets user by id with addresses
    /// </summary>
    /// <exception cref="UserNotFoundException"></exception>
    Task<ApplicationUser> GetUserByIdAsync(string id);

    /// <summary>
    /// Gets user by email
    /// </summary>
    /// <exception cref="UserNotFoundException"></exception>
    Task<ApplicationUser> GetUserByEmailAsync(string email);

    /// <summary>
    /// Creates new user with credentials
    /// </summary>
    /// <exception cref="UserCreatingException"></exception>
    Task<ApplicationUser> CreateUserAsync(string email, string firstName, string lastName, 
                                          string contact, string password);

    /// <summary>
    /// Updates user by email
    /// </summary>
    /// <exception cref="UserNotFoundException"></exception>
    Task UpdateUserAsync(string userId, string firstName, string lastName, string contact);

    /// <summary>
    /// Gets user addresses by id
    /// </summary>
    /// <exception cref="UserNotFoundException"></exception>
    Task<IEnumerable<UserAddress>> GetAddressesAsync(string id);

    /// <summary>
    /// Creates new address for user by user name
    /// </summary>
    /// <exception cref="UserNotFoundException"></exception>
    Task<int> CreateAddressAsync(string userId, string postalCode, string country,
                                 string city, string label);

    /// <summary>
    /// Delete address by id from user
    /// </summary>
    /// <param name="id">address id</param>
    /// <param name="userId">user id</param>
    /// <exception cref="UserNotFoundException"></exception>
    /// <exception cref="AddressNotFoundException"></exception>
    Task DeleteAddressAsync(int id, string userId);
}
