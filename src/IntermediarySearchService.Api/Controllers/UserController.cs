using AutoMapper;
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
    private readonly IOrderService _orderService;
    private readonly IMapper _mapper;
    private readonly ILogger<UserController> _logger;
    public UserController(IUserService userService, IOrderService orderService,
                          IMapper mapper, ILogger<UserController> logger)
    {
        _userService = userService;
        _orderService = orderService;
        _mapper = mapper;
        _logger = logger;
    }

    [Authorize]
    [Route("addresses")]
    [HttpGet]
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


    /// <summary>
    /// Get user's orders
    /// </summary>
    /// <param name="orderStates">order's states array</param>
    /// <param name="shops">shops array</param>
    /// <param name="sortBy">sort type (newest, oldest, minmax, maxmin)</param>
    /// <remarks>
    /// Username is taken from httpContext
    /// </remarks>
    /// <returns>User's orders</returns>
    /// <response code="200">Return user's orders</response>
    /// <response code="204">Not found orders</response>
    /// <response code="401">Unauthorized</response>
    [Authorize]
    [Route("orders")]
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetUserOrders([FromQuery] State[] orderStates,
                                                   [FromQuery] string[] shops,
                                                   [FromQuery] string? sortBy)
    {
        var orders = await _orderService.GetUserOrdersAsync(UserName, orderStates, shops, sortBy);
        if (orders.Count() == 0)
            return NoContent();
        else
        {
            var mappedOrders = _mapper.Map<IEnumerable<OrderModel>>(orders);
            return Ok(mappedOrders);
        }
    }
}
