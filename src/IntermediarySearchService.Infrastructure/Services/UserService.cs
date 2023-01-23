

using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Exceptions;
using IntermediarySearchService.Core.Interfaces;
using IntermediarySearchService.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace IntermediarySearchService.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task AddNewAddressToUser(string email, Address newAddress)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user != null)
        {
            user.AddAddress(newAddress);
            await _userManager.UpdateAsync(user);
        }
        else
            throw new UserNotFoundException(email);
    }

    public async Task DeleteAddress(string email, Address address)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user != null)
        {
            user.DeleteAddress(address);
            await _userManager.UpdateAsync(user);
        }
        else
            throw new UserNotFoundException(email);
    }

    public async Task<IEnumerable<Address>> GetUserAddresses(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user != null)
            return user.Addresses;
        else
            throw new UserNotFoundException(email);
    }
}
