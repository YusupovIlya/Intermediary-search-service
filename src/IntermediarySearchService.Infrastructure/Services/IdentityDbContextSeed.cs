﻿using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using IntermediarySearchService.Core.Constants;
using IntermediarySearchService.Infrastructure.Identity;

namespace IntermediarySearchService.Infrastructure.Services;

public class IdentityDbContextSeed
{
    public static async Task SeedAsync(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {

        await roleManager.CreateAsync(new IdentityRole("User"));

        var defaultUser = new ApplicationUser(AuthConstants.FIRST_NAME, AuthConstants.LAST_NAME, AuthConstants.EMAIL);

        await userManager.CreateAsync(defaultUser, AuthConstants.DEFAULT_PASSWORD);

        defaultUser = await userManager.FindByEmailAsync(AuthConstants.EMAIL);
        await userManager.AddToRoleAsync(defaultUser, "User");
    }
}