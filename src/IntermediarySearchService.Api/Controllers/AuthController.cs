using IntermediarySearchService.Api.DtoModels;
using IntermediarySearchService.Core.Interfaces;
using IntermediarySearchService.Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace IntermediarySearchService.Api.Controllers;

public class AuthController : BaseController
{
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenClaimsService;

    public AuthController(SignInManager<ApplicationUser> signInManager,
                          UserManager<ApplicationUser> userManager,
                          ITokenService tokenClaimsService)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _tokenClaimsService = tokenClaimsService;
    }

    [AllowAnonymous]
    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login(LoginRequestModel request)
    {
        var response = new LoginResponseModel(Guid.NewGuid().ToString());
        var user = await _userManager.FindByEmailAsync(request.Email);
        if(user != null)
        {
            response.User = new UserModel(user.FirstName, user.LastName);
            var result = await _signInManager.PasswordSignInAsync(user.UserName, request.Password, false, false);
            if (result.Succeeded)
            {
                response.Token = await _tokenClaimsService.GetTokenAsync(user.UserName);
                response.Message = "You have been successfully logged in!";
            }
            else
            {
                response.Message = "Wrong password!";
            }
        }
        else
        {
            response.Message = "Wrong login!";
        }
        return Ok(response);
    }
}
