

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
        var user = await GetUserAsync(userId);
        var address = new UserAddress(postalCode, country, city, label);
        user.AddAddress(address);
        await _userManager.UpdateAsync(user);
        return address.Id;
    }

    public async Task DeleteAddressAsync(int id, string userId)
    {
        var user = await GetUserAsync(userId);
        user.RemoveAddress(id);
        await _userManager.UpdateAsync(user);
    }

    public async Task<IEnumerable<UserAddress>> GetAddressesAsync(string id)
    {
        var user = await GetUserAsync(id);
        return user.Addresses;
    }

    public async Task<ApplicationUser> GetUserAsync(string id)
    {
        var user = await _userManager.Users
                            .Include(u => u.Addresses)
                            .FirstOrDefaultAsync(u => id == u.Id);

        if (user != null)
            return user;
        else
            throw new UserNotFoundException(id);
    }
}
