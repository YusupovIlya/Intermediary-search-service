﻿

using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Exceptions;
using IntermediarySearchService.Core.Interfaces;
using IntermediarySearchService.Infrastructure.Identity;
using IntermediarySearchService.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace IntermediarySearchService.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IOrderService _orderService;

    public UserService(UserManager<ApplicationUser> userManager, IOrderService orderService)
    {
        _userManager = userManager;
        _orderService = orderService;
    }

    public async Task<int> CreateAddressAsync(string userId, string postalCode, string country, string city, string label)
    {
        var user = await GetUserByIdAsync(userId);
        var address = new UserAddress(postalCode, country, city, label);
        user.AddAddress(address);
        await _userManager.UpdateAsync(user);
        return address.Id;
    }

    public async Task<ApplicationUser> CreateUserAsync(string email, string firstName, string lastName, string contact, string password)
    {
        var user = new ApplicationUser(firstName, lastName, email, contact);
        var result = await _userManager.CreateAsync(user, password);
        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(user, "User");
            return user;
        }
        else
        {
            var message = string.Join(' ', result.Errors.Select(e => e.Description));
            throw new UserCreatingException(email, message);
        }
    }

    public async Task DeleteAddressAsync(int id, string userId)
    {
        var user = await GetUserByIdAsync(userId);
        user.RemoveAddress(id);
        await _userManager.UpdateAsync(user);
    }

    public async Task DeleteUserAsync(string id)
    {
        var user = await GetUserByIdAsync(id);
        await _orderService.DeleteUserOrdersAsync(user.UserName);
        await _userManager.DeleteAsync(user);
    }

    public async Task<IEnumerable<UserAddress>> GetAddressesAsync(string id)
    {
        var user = await GetUserByIdAsync(id);
        return user.Addresses;
    }

    public async Task<IEnumerable<ApplicationUser>> GetAllUsersAsync()
    {
        var users = await _userManager.GetUsersInRoleAsync("User");
        return users.AsEnumerable();
    }

    public async Task LockUserAsync(string id)
    {
        var endDate = new DateTime(2025, 1, 1);
        var user = await GetUserByIdAsync(id);
        await _userManager.SetLockoutEnabledAsync(user, true);
        await _userManager.SetLockoutEndDateAsync(user, endDate);
    }

    public async Task UnLockUserAsync(string id)
    {
        var user = await GetUserByIdAsync(id);
        await _userManager.SetLockoutEndDateAsync(user, null);
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
