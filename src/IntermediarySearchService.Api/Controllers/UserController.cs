using IntermediarySearchService.Api.DtoModels;
using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Exceptions;
using IntermediarySearchService.Core.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IntermediarySearchService.Api.Controllers;

public class UserController : BaseController
{
    private readonly IUserService _userService;
    private readonly ILogger<UserController> _logger;
    public UserController(IUserService userService, ILogger<UserController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [Route("addresses")]
    [HttpGet]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> GetUserAddresses()
    {
        try
        {
            var addresses = await _userService.GetUserAddresses(UserName);
            return Ok(addresses);
        }
        catch (UserNotFoundException exc)
        {
            _logger.LogError(exc.Message);
            var response = new ResponseModel(UserName, ResponseModel.Error);
            return NotFound(response);
        }
    }

    [Route("addresses/add")]
    [HttpPost]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> AddAddress([FromBody] Address newAddress)
    {
        try
        {
            await _userService.AddNewAddressToUser(UserName, newAddress);
            var response = new ResponseModel(UserName, ResponseModel.Success);
            return Ok(response);
        }
        catch (UserNotFoundException exc)
        {
            _logger.LogError(exc.Message);
            var response = new ResponseModel(UserName, ResponseModel.Error);
            return NotFound(response);
        }
    }

    [Route("addresses/delete")]
    [HttpDelete]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> DeleteAddress([FromBody] Address address)
    {
        try
        {
            await _userService.DeleteAddress(UserName, address);
            var response = new ResponseModel(UserName, ResponseModel.Success);
            return Ok(response);
        }
        catch (UserNotFoundException exc)
        {
            _logger.LogError(exc.Message);
            var response = new ResponseModel(UserName, ResponseModel.Error);
            return NotFound(response);
        }
    }
}
