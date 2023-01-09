using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using IntermediarySearchService.Core.Constants;

namespace IntermediarySearchService.Infrastructure.Identity;

public class IdentityDbContextSeed
{
    public static async Task SeedAsync(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {

        await roleManager.CreateAsync(new IdentityRole("User"));

        var defaultUser = new ApplicationUser(AuthConstants.USER_NAME, AuthConstants.FIRST_NAME,
                                              AuthConstants.LAST_NAME, AuthConstants.EMAIL);

        await userManager.CreateAsync(defaultUser, AuthConstants.DEFAULT_PASSWORD);

        defaultUser = await userManager.FindByNameAsync(AuthConstants.USER_NAME);
        await userManager.AddToRoleAsync(defaultUser, "User");
    }
}
