using IntermediarySearchService.Api.DtoModels;
using IntermediarySearchService.Api.Services;
using IntermediarySearchService.Core.Exceptions;
using IntermediarySearchService.Core.Interfaces;
using IntermediarySearchService.Infrastructure.Identity;
using IntermediarySearchService.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace IntermediarySearchService.Api.Controllers;

[TypeFilter(typeof(EntityNotFoundExceptionFilter))]
[AllowAnonymous]
public class AuthController : BaseController
{
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenClaimsService;
    private readonly IEmailService _emailService;
    private readonly IUserService _userService;
    private readonly IConfiguration _configuration;

    public AuthController(SignInManager<ApplicationUser> signInManager,
                          UserManager<ApplicationUser> userManager,
                          IUserService userService,
                          ITokenService tokenClaimsService,
                          IEmailService emailService,
                          IConfiguration configuration)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _tokenClaimsService = tokenClaimsService;
        _emailService = emailService;
        _userService = userService;
        _configuration = configuration;
    }


    /// <summary>
    /// Generates access token for user and returns him credentials
    /// </summary>
    /// <param name="request">User credentials</param>
    /// <response code="200">User credentials</response>
    /// <response code="400">Wrong data</response>
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(LoginResponseModel))]
    [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(LoginResponseModel))]
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
                return Ok(response);
            }
            else if (result.IsNotAllowed)
                response.Message = "Email isn't confirmed!";

            else if(result.IsLockedOut)
                response.Message = "Your account is blocked!";
            else
                response.Message = "Wrong password!";
            return BadRequest(response);
        }
        else
        {
            response.Message = "Wrong login!";
            return BadRequest(response);
        }
    }


    /// <summary>
    /// Registrates new user
    /// </summary>
    /// <param name="model">User credentials</param>
    /// <response code="200">User was registered</response>
    /// <response code="400">Invalid model request</response>
    /// <response code="409">User with this email already has registered</response>
    /// <response code="503">Internal error with sending email confirmation</response>
    [HttpPost("registration")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(LoginResponseModel))]
    [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ValidationProblemDetails))]
    [ProducesResponseType(StatusCodes.Status409Conflict, Type = typeof(ResponseModel))]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable, Type = typeof(ResponseModel))]
    public async Task<IActionResult> Registration([FromBody] NewUserModel model)
    {
        try
        {
            var user = await _userService.CreateUserAsync(model.Email, model.FirstName, model.LastName,
                                                          model.AdditionalContact, model.Password);
            string confirmationEmailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            var mail = _emailService.PrepareConfirmationMail(user.FirstName, user.LastName, confirmationEmailToken, user.Email, user.Id);
            var res = await _emailService.SendAsync(mail);
            if (res)
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
            return Conflict(response);
        }
    }


    /// <summary>
    /// Activtes user account
    /// </summary>
    /// <param name="userId">user id</param>
    /// <param name="token">email confirmation token</param>
    /// <response code="302">User acount was activated</response>
    /// <response code="400">Invalid token</response>
    /// <response code="404">User not found with this id</response>
    [HttpGet("{userId:guid}")]
    [ProducesResponseType(StatusCodes.Status302Found, Type = typeof(EmptyResult))]
    [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(EmptyResult))]
    [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseModel))]
    public async Task<IActionResult> Activate([FromRoute] string userId,
                                              [FromQuery] string token)
    {
        var clientURL = _configuration.GetSection("CLIENT_URL").Value;
        var user = await _userService.GetUserByIdAsync(userId);
        var res = await _userManager.ConfirmEmailAsync(user, token);
        if (res.Succeeded)
            return Redirect(clientURL);
        else 
            return BadRequest();
    }
}
