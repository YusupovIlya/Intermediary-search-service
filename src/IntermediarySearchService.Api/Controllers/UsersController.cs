using AutoMapper;
using IntermediarySearchService.Api.DtoModels;
using IntermediarySearchService.Api.Services;
using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Interfaces;
using IntermediarySearchService.Infrastructure.Identity;
using IntermediarySearchService.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntermediarySearchService.Api.Controllers;

[TypeFilter(typeof(EntityNotFoundExceptionFilter))]
[Authorize]
public class UsersController : BaseController
{
    private readonly IUserService _userService;
    private readonly IOrderService _orderService;
    private readonly IOfferService _offerService;
    private readonly IMapper _mapper;
    public UsersController(IUserService userService, IOrderService orderService, 
                          IOfferService offerService, IMapper mapper)
    {
        _userService = userService;
        _orderService = orderService;
        _offerService = offerService;
        _mapper = mapper;
    }

    /// <summary>
    /// Gets user profile by email
    /// </summary>
    /// <param name="email">user email</param>
    /// <response code="200">User profile</response>
    /// <response code="401">Unauthorized</response>
    /// <response code="404">User not found</response>
    [HttpGet("{email:length(3,100)}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserProfileModel))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized, Type = typeof(EmptyResult))]
    [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseModel))]
    public async Task<IActionResult> GetUserProfile([FromRoute] string email)
    {
        var user = await _userService.GetUserByEmailAsync(email);
        var mappedUser = _mapper.Map<UserProfileModel>(user);
        return Ok(mappedUser);
    }

    /// <summary>
    /// Updates user profile
    /// </summary>
    /// <param name="userId">user id</param>
    /// <param name="model">updated user profile</param>
    /// <response code="200">User profile was updated</response>
    /// <response code="401">Unauthorized</response>
    /// <response code="404">User not found</response>
    [HttpPut("{userId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseModel))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized, Type = typeof(EmptyResult))]
    [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseModel))]
    public async Task<IActionResult> UpdateUserProfile([FromRoute] string userId,
                                                       [FromBody] UserProfileModel model)
    {
        await _userService.UpdateUserAsync(userId, model.FirstName, model.LastName, model.AdditionalContact);
        var response = new ResponseModel(userId.ToString(), $"User profile with id - {userId} was updated");
        return Ok(response);

    }


    /// <summary>
    /// Gets user addresses list
    /// </summary>
    /// <param name="userId">user id</param>
    /// <response code="200">List of user addresses</response>
    /// <response code="204">User doesn't have addresses</response>
    /// <response code="401">Unauthorized</response>
    /// <response code="404">User not found</response>
    [HttpGet("{userId:guid}/addresses")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserAddress))]
    [ProducesResponseType(StatusCodes.Status204NoContent, Type = typeof(EmptyResult))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized, Type = typeof(EmptyResult))]
    [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseModel))]
    public async Task<IActionResult> GetAddresses([FromRoute] string userId)
    {
        var addresses = await _userService.GetAddressesAsync(userId);
        if (addresses.Count() == 0) return NoContent();
        else return Ok(addresses);
    }

    /// <summary>
    /// Added new address to user
    /// </summary>
    /// <param name="userId">user id</param>
    /// <param name="model">new address model</param>
    /// <response code="201">Address was added to user</response>
    /// <response code="400">Address model isn't valid</response>
    /// <response code="401">Unauthorized</response>
    /// <response code="404">User not found</response>
    [HttpPost("{userId:guid}/addresses")]
    [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(ResponseModel))]
    [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ValidationProblemDetails))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized, Type = typeof(EmptyResult))]
    [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseModel))]
    public async Task<IActionResult> CreateAddress([FromRoute] string userId,
                                                   [FromBody] UserAddress model)
    {
        int id = await _userService.CreateAddressAsync(userId, model.PostalCode, model.Country, model.City, model.Label);
        var response = new ResponseModel(id.ToString(), ResponseModel.Success);
        return Created($"{Request.Path}", response);
    }

    /// <summary>
    /// Deletes address by id
    /// </summary>
    /// <param name="userId">user id</param>
    /// <param name="id">address id</param>
    /// <response code="204">Address was deleted</response>
    /// <response code="401">Unauthorized</response>
    /// <response code="404">User not found</response>
    [HttpDelete("{userId:guid}/addresses/{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent, Type = typeof(EmptyResult))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized, Type = typeof(EmptyResult))]
    [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseModel))]
    public async Task<IActionResult> DeleteAddress([FromRoute] string userId,
                                                   [FromRoute] int id)
    {
        await _userService.DeleteAddressAsync(id, userId);
        return NoContent();
    }


    /// <summary>
    /// Gets user's orders
    /// </summary>
    /// <param name="orderStates">order's states array</param>
    /// <param name="shops">shops array</param>
    /// <param name="sortBy">sort type (newest, oldest, minmax, maxmin)</param>
    /// <response code="200">Return user's orders</response>
    /// <response code="204">Not found orders</response>
    /// <response code="401">Unauthorized</response>
    [HttpGet("{userId:guid}/orders")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<OrderModel>))]
    [ProducesResponseType(StatusCodes.Status204NoContent, Type = typeof(EmptyResult))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized, Type = typeof(EmptyResult))]
    public async Task<IActionResult> GetOrders([FromQuery] OrderState[] orderStates,
                                               [FromQuery] string[] shops,
                                               [FromQuery] string? sortBy)
    {
        var orders = await _orderService.GetUserOrdersAsync(UserName, orderStates, shops, sortBy);
        if (orders.Count() == 0) return NoContent();
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
    /// <response code="200">Return offers by params</response>
    /// <response code="204">Not found offers with filter's params</response>
    /// <response code="401">Unauthorized</response>
    [HttpGet("{userId:guid}/offers")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<OfferModel>))]
    [ProducesResponseType(StatusCodes.Status204NoContent, Type = typeof(EmptyResult))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized, Type = typeof(EmptyResult))]
    public async Task<IActionResult> GetOffers([FromQuery] OfferState[] offerStates, 
                                               [FromQuery] string? sortBy)
    {
        var offers = await _offerService.GetUserOffersAsync(UserName, offerStates, sortBy);
        if (offers.Count() == 0) return NoContent();
        else
        {
            var mappedOffers = _mapper.Map<IEnumerable<OfferModel>>(offers);
            return Ok(mappedOffers);
        }
    }
}
