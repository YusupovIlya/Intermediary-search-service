

using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Exceptions;
using IntermediarySearchService.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace IntermediarySearchService.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<int> CreateAddressAsync(string userId, string postalCode, string country, string city, string label)
    {
        var user = await GetUserByIdAsync(userId);
        var address = new UserAddress(postalCode, country, city, label);
        user.AddAddress(address);
        await _userManager.UpdateAsync(user);
        return address.Id;
    }

    public async Task DeleteAddressAsync(int id, string userId)
    {
        var user = await GetUserByIdAsync(userId);
        user.RemoveAddress(id);
        await _userManager.UpdateAsync(user);
    }

    public async Task<IEnumerable<UserAddress>> GetAddressesAsync(string id)
    {
        var user = await GetUserByIdAsync(id);
        return user.Addresses;
    }

    public async Task<ApplicationUser> GetUserByEmailAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user != null)
            return user;
        else
            throw new UserNotFoundException(email);
    }

    public async Task<ApplicationUser> GetUserByIdAsync(string id)
    {
        var user = await _userManager.Users
                            .Include(u => u.Addresses)
                            .FirstOrDefaultAsync(u => id == u.Id);

        if (user != null)
            return user;
        else
            throw new UserNotFoundException(id);
    }

    public async Task UpdateUserAsync(string userId, string firstName, string lastName, string contact)
    {
        var user = await GetUserByIdAsync(userId);
        user.FirstName = firstName;
        user.LastName = lastName;
        user.AdditionalContact = contact;
        await _userManager.UpdateAsync(user);
    }
}
