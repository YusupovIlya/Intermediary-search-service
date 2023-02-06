using AutoMapper;
using IntermediarySearchService.Api.DtoModels;
using IntermediarySearchService.Core.Exceptions;
using IntermediarySearchService.Core.Interfaces;
using IntermediarySearchService.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntermediarySearchService.Api.Controllers;

[ApiController]
public class OrdersController : BaseController
{
    private readonly IOrderService _orderService;
    private readonly IMapper _mapper;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(IOrderService orderService, IMapper mapper, ILogger<OrdersController> logger)
    {
        _orderService = orderService;
        _mapper = mapper;
        _logger = logger;
    }

    /// <summary>
    /// Get order by id
    /// </summary>
    /// <param name="id">order id</param>
    /// <remarks>
    /// GET api/v1/orders/5
    /// </remarks>
    /// <returns>Order by id</returns>
    /// <response code="200">Returns order by id</response>
    /// <response code="404">Order not found</response>
    [AllowAnonymous]
    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(OrderModel))]
    [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseModel))]
    public async Task<IActionResult> GetOrderById([FromRoute] int id)
    {
        try
        {
            var order = await _orderService.GetByIdAsync(id);
            var orderDto = _mapper.Map<OrderModel>(order);
            return Ok(orderDto);
        }
        catch(OrderNotFoundException ex)
        {
            _logger.LogInformation(ex.Message);
            var response = new ResponseModel(id.ToString(), ex.Message);
            return NotFound(response);
        }
    }

    /// <summary>
    /// Get paginated orders list by params
    /// </summary>
    /// <param name="page">page number</param>
    /// <param name="pageSize">number of items per page</param>
    /// <param name="shops">shops array</param>
    /// <param name="countries">countries array</param>
    /// <param name="numOrderItems">max number of items in order</param>
    /// <param name="minOrderPrice">min order's price</param>
    /// <param name="maxOrderPrice">max order's price</param>
    /// <param name="sortBy">sort type (newest, oldest, minmax, maxmin)</param>
    /// <returns>Filtered orders by page number and page size</returns>
    /// <response code="200">Return orders by params</response>
    /// <response code="204">Not found orders with filter's params</response>
    /// <response code="400">Model state invalid</response>
    [AllowAnonymous]
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PaginatedOrdersModel))]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ValidationProblemDetails))]
    public async Task<IActionResult> GetPaginatedOrders([FromQuery] int page,
                                                        [FromQuery] int pageSize,
                                                        [FromQuery] string[] shops,
                                                        [FromQuery] string[] countries,
                                                        [FromQuery] int? numOrderItems,
                                                        [FromQuery] int? minOrderPrice,
                                                        [FromQuery] int? maxOrderPrice,
                                                        [FromQuery] string? sortBy)
    {
        var orders = await _orderService.GetOrdersByPageNumberAsync(page, pageSize, shops, countries,
                                                                    numOrderItems, minOrderPrice, maxOrderPrice, sortBy);
        if (orders.Count == 0) 
            return NoContent();
        else
        {
            var paginationMeta = new PaginationMetaModel(orders.CurrentPage, orders.TotalPages, orders.PageSize,
                                             orders.TotalCount, orders.HasPrevious, orders.HasNext);
            var mappedOrders = _mapper.Map<IEnumerable<OrderModel>>(orders);
            var result = new PaginatedOrdersModel(paginationMeta, mappedOrders);
            return Ok(result);
        }
    }

    /// <summary>
    /// Creates new order
    /// </summary>
    /// <param name="order">New order params</param>
    /// <returns>Creating result message</returns>
    /// <response code="201">Returns success message</response>
    /// <response code="400">Model state invalid</response>
    /// <response code="401">Unauthorized</response>
    [Authorize]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(ResponseModel))]
    [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ValidationProblemDetails))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateOrder([FromBody] NewOrderModel order)
    {
        int orderId = await _orderService.CreateAsync(UserName, order.SiteName, order.SiteLink,
                                        order.PerformerFee, order.OrderItems, order.Address);
        var response = new ResponseModel(orderId.ToString(), ResponseModel.Success);
        return Created($"{Request.Path}/{orderId}", response);
    }

    /// <summary>
    /// Selects an offer by order id and offer id
    /// </summary>
    /// <remarks>PUT api/v1/orders/23/offers/1</remarks>
    /// <param name="orderId">order id</param>
    /// <param name="offerId">offer id</param>
    /// <returns>Returns update result message</returns>
    /// <response code="200">Returns success message</response>
    /// <response code="404">Not found offer or order with these ids</response>
    /// <response code="401">Unauthorized</response>
    [Authorize]
    [HttpPut("{orderId:int}/offers/{offerId:int}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseModel))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseModel))]
    public async Task<IActionResult> SelectOffer([FromRoute] int orderId, [FromRoute] int offerId)
    {
        try
        {
            int id = await _orderService.SelectOfferForOrderByIdAsync(orderId, offerId);
            var response = new ResponseModel(id.ToString(), $"offer status with id - {id} was updated");
            return Ok(response);
        }
        catch(OfferNotFoundException ex)
        {
            _logger.LogInformation(ex.Message);
            var response = new ResponseModel(offerId.ToString(), ex.Message);
            return NotFound(response);
        }
        catch (OrderNotFoundException ex)
        {
            _logger.LogInformation(ex.Message);
            var response = new ResponseModel(orderId.ToString(), ex.Message);
            return NotFound(response);
        }
    }

    /// <summary>
    /// Update order
    /// </summary>
    /// <remarks>PUT api/v1/orders/5</remarks>
    /// <param name="id">order id</param>
    /// <param name="model">updated order model</param>
    /// <response code="200">Order was updated</response>
    /// <response code="401">Unauthorized</response>
    /// <response code="403">Forbidden</response>
    /// <response code="404">Order wasn't found with this id</response>
    [Authorize]
    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseModel))]
    public async Task<IActionResult> UpdateOrder([FromRoute] int id, [FromBody] EditedOrderModel model)
    {
        try
        {
            await _orderService.UpdateAsync(UserName, id, model.SiteName, model.SiteLink, model.Address,
                                            model.PerformerFee, model.OrderItems);
            return Ok();
        }
        catch (OrderNotFoundException ex)
        {
            _logger.LogInformation(ex.Message);
            var response = new ResponseModel(id.ToString(), ex.Message);
            return NotFound(response);
        }
        catch (ForbiddenActionException ex)
        {
            _logger.LogInformation(ex.Message);
            return Forbid();
        }
    }

    /// <summary>
    /// Deletes order by id
    /// </summary>
    /// <remarks>DELETE api/v1/orders/5</remarks>
    /// <param name="id">order id</param>
    /// <response code="204">Order was deleted</response>
    /// <response code="401">Unauthorized</response>
    /// <response code="403">Forbidden</response>
    /// <response code="404">Order wasn't found with this id</response>
    [Authorize]
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseModel))]
    public async Task<IActionResult> DeleteOrderById(int id)
    {
        try
        {
            await _orderService.DeleteAsync(id, UserName);
            return NoContent();
        }
        catch (OrderNotFoundException ex)
        {
            _logger.LogInformation(ex.Message);
            var response = new ResponseModel(id.ToString(), ex.Message);
            return NotFound(response);
        }
        catch (ForbiddenActionException ex)
        {
            _logger.LogInformation(ex.Message);
            return Forbid();
        }
    }

    /// <summary>
    /// Get params list for order's filter
    /// </summary>
    /// <remarks>GET /api/v1/orders/params/0</remarks>
    /// <param name="type">type param for filter</param>
    /// <response code="204">Empty list</response>
    /// <response code="200">params array</response>
    [AllowAnonymous]
    [HttpGet("params/{type:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Array))]
    public async Task<IActionResult> GetParamsForFilter([FromRoute] FilterParam type)
    {
        var result = await _orderService.GetParam(type, UserName);
        if (result.Length == 0)
            return NoContent();
        else
            return Ok(result);
    }
}
