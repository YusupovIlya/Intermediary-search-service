using AutoMapper;
using IntermediarySearchService.Api.DtoModels;
using IntermediarySearchService.Core.Entities.OfferAggregate;
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
    private readonly IOfferService _offerService;
    private readonly IMapper _mapper;
    private readonly ILogger<UserController> _logger;
    public UserController(IUserService userService, IOrderService orderService, IOfferService offerService,
                          IMapper mapper, ILogger<UserController> logger)
    {
        _userService = userService;
        _orderService = orderService;
        _offerService = offerService;
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
    /// Gets user's orders
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
    [HttpGet("orders")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<OrderModel>))]
    [ProducesResponseType(StatusCodes.Status204NoContent, Type = typeof(EmptyResult))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized, Type = typeof(EmptyResult))]
    public async Task<IActionResult> GetOrders([FromQuery] OrderState[] orderStates,
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

    /// <summary>
    /// Gets user offers by params
    /// </summary>
    /// <param name="offerStates">array of offer states</param>
    /// <param name="sortBy">sort type (newest, oldest, minmax, maxmin)</param>
    /// <returns>Filtered offers</returns>
    /// <response code="200">Return offers by params</response>
    /// <response code="204">Not found offers with filter's params</response>
    /// <response code="401">Unauthorized</response>
    [Authorize]
    [HttpGet("offers")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<OfferModel>))]
    [ProducesResponseType(StatusCodes.Status204NoContent, Type = typeof(EmptyResult))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized, Type = typeof(EmptyResult))]
    public async Task<IActionResult> GetOffers([FromQuery] OfferState[] offerStates, 
                                               [FromQuery] string? sortBy)
    {
        var offers = await _offerService.GetUserOffersAsync(UserName, offerStates, sortBy);
        if (offers.Count() == 0)
            return NoContent();
        else
        {
            var mappedOffers = _mapper.Map<IEnumerable<OfferModel>>(offers);
            return Ok(mappedOffers);
        }
    }
}
