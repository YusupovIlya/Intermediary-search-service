using IntermediarySearchService.Api.DtoModels;
using IntermediarySearchService.Core.Exceptions;
using IntermediarySearchService.Core.Interfaces;
using IntermediarySearchService.Infrastructure.Identity;
using IntermediarySearchService.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace IntermediarySearchService.Api.Controllers;

public class AuthController : BaseController
{
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenClaimsService;
    private readonly IEmailService _emailService;
    private readonly IUserService _userService;

    public AuthController(SignInManager<ApplicationUser> signInManager,
                          UserManager<ApplicationUser> userManager,
                          IUserService userService,
                          ITokenService tokenClaimsService,
                          IEmailService emailService)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _tokenClaimsService = tokenClaimsService;
        _emailService = emailService;
        _userService = userService;
    }

    [AllowAnonymous]
    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login(LoginRequestModel request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        LoginResponseModel response = new LoginResponseModel();
        if (user != null)
        {
            var result = await _signInManager.PasswordSignInAsync(user.UserName, request.Password, false, false);
            if (result.Succeeded)
            {
                var role = await _userManager.GetRolesAsync(user).ContinueWith(r => r.Result.First());
                response.Id = user.Id;
                response.Role = role;
                response.Email = user.Email;
                response.Token = await _tokenClaimsService.GetTokenAsync(user.UserName);
                response.Message = "You have been successfully logged in!";
            }
            else
            {
                response.Message = "Wrong password!";
                return BadRequest(response);
            }
        }
        else
        {
            response.Message = "Wrong login!";
            return BadRequest(response);
        }
        return Ok(response);
    }


    [AllowAnonymous]
    [HttpPost("registration")]
    public async Task<IActionResult> Registration([FromBody] NewUserModel model)
    {
        try
        {
            var user = await _userService.CreateUserAsync(model.Email, model.FirstName, model.LastName,
                                                          model.AdditionalContact, model.Password);
            string confirmationEmailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);

           // var mail = _emailService.PrepareConfirmationMail(user.FirstName, user.LastName, confirmationEmailToken, user.Email, user.Id);
           // var res = await _emailService.SendAsync(mail);
            if (false)
            {
                var response = new ResponseModel(model.Email, "User was registered!");
                return Ok(response);
            }
            else
            {
                var response = new ResponseModel(model.Email, "There was an error sending the email, please try again later");
                return StatusCode(503, response);
            }
        }
        catch(UserCreatingException ex)
        {
            var response = new ResponseModel(model.Email, ex.Message);
            return BadRequest(response);
        }
    }

    [AllowAnonymous]
    [HttpGet("{userId:guid}")]
    public async Task<IActionResult> Activate([FromRoute] string userId,
                                              [FromQuery] string token)
    {
        var user = await _userManager.FindByIdAsync(userId);
        var res = await _userManager.ConfirmEmailAsync(user, token);
        if (res.Succeeded)
            return Redirect("http://localhost:3000/");
        else return Ok();
    }
}
