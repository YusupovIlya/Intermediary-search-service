using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using IntermediarySearchService.Core.Constants;
using IntermediarySearchService.Infrastructure.Identity;
using Microsoft.Extensions.Configuration;

namespace IntermediarySearchService.Infrastructure.Services;

public class IdentityDbContextSeed
{
    public static async Task SeedAsync(UserManager<ApplicationUser> userManager, 
                                       RoleManager<IdentityRole> roleManager,
                                       IConfiguration configuration)
    {
        //var adminCredentials = configuration.GetSection("Admin");

        await roleManager.CreateAsync(new IdentityRole("User"));
        //await roleManager.CreateAsync(new IdentityRole("Admin"));

        var defaultUser = new ApplicationUser(AuthConstants.FIRST_NAME, AuthConstants.LAST_NAME, AuthConstants.EMAIL, AuthConstants.DEFAULT_CONTACT);
        //var admin = new ApplicationUser(adminCredentials["FirstName"], adminCredentials["LastName"], adminCredentials["Email"], adminCredentials["Contact"]);

        await userManager.CreateAsync(defaultUser, AuthConstants.DEFAULT_PASSWORD);
        //await userManager.CreateAsync(admin, adminCredentials["Password"]);

        defaultUser = await userManager.FindByEmailAsync(AuthConstants.EMAIL);
        defaultUser.EmailConfirmed = true;
        await userManager.AddToRoleAsync(defaultUser, "User");

        //admin = await userManager.FindByEmailAsync(adminCredentials["Email"]);
        //admin.EmailConfirmed = true;
        //await userManager.AddToRoleAsync(admin, "Admin");
    }
}
