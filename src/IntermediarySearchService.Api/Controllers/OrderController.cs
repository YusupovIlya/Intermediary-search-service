using AutoMapper;
using IntermediarySearchService.Api.DtoModels;
using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntermediarySearchService.Api.Controllers;

[ApiController]
public class OrderController : BaseController
{
    private readonly IOrderService _orderService;
    private readonly IMapper _mapper;

    public OrderController(IOrderService orderService, IMapper mapper)
    {
        _orderService = orderService;
        _mapper = mapper;
    }

    // GET: api/v1/order/all
    //[Route("all")]
    //[HttpGet]
    //public async Task<IActionResult> Get()
    //{
    //    //var orders = await _orderService.GetAllAsync(GetUserName());
    //    var orders = await _orderService.GetUserOrdersAsync("ilya");
    //    var mappedOrders = _mapper.Map<IEnumerable<OrderModel>>(orders);
    //    return Ok(mappedOrders);
    //}

    // GET api/v1/order/5
    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var order = await _orderService.GetByIdAsync(id);
        var orderDto = _mapper.Map<OrderModel>(order);
        return Ok(orderDto);
    }

    /// <summary>
    /// Get paginated order list by params
    /// </summary>
    /// <param name="page">page number</param>
    /// <param name="pageSize">number of items per page</param>
    /// <param name="shops"></param>
    /// <param name="countries"></param>
    /// <param name="numOrderItems">max number of items in order</param>
    /// <param name="minOrderPrice">min order's price</param>
    /// <param name="maxOrderPrice">max order's price</param>
    /// <response code="200">Returns items</response>
    /// <response code="400">Model state invalid</response>
    // GET api/v1/order/all/
    [Route("all")]
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
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
        var paginationMeta = new PaginationMetaModel(orders.CurrentPage, orders.TotalPages, orders.PageSize,
                                                     orders.TotalCount, orders.HasPrevious, orders.HasNext);
        var mappedOrders = _mapper.Map<IEnumerable<OrderModel>>(orders);
        var result = new PaginatedOrdersModel(paginationMeta, mappedOrders);
        return Ok(result);
    }

    // POST api/v1/order/create
    [Route("create")]
    [HttpPost]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> CreateOrder([FromBody] NewOrderModel order)
    {
        int orderId = await _orderService.CreateAsync(UserName, order.SiteName, order.SiteLink,
                                        order.PerformerFee, order.OrderItems, order.Address);
        var response = new ResponseModel(orderId.ToString(), ResponseModel.Success);
        return Ok(response);
    }

    // PUT api/v1/order/additems/5
    [Route("additems/{id:int}")]
    [HttpPut]
    public async Task<IActionResult> Put(int id, [FromBody] List<OrderItem> orderItems)
    {
        await _orderService.AddItemsAsync(id, orderItems);
        return Ok();
    }

    // PUT api/v1/order/deleteitems/5
    [Route("deleteitems/{id:int}")]
    [HttpPut]
    public async Task<IActionResult> Put(int id, [FromBody] int[] itemsId)
    {
        await _orderService.DeleteItemsAsync(id, itemsId);
        return Ok();
    }

    // DELETE api/v1/order/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _orderService.DeleteAsync(id);
        return Ok();
    }

    // GET: api/v1/order/shopslist
    [Route("shopslist")]
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetShopsList()
    {
        var shopsList = await _orderService.GetShopsForFilter();
        return Ok(shopsList);
    }

    // GET: api/v1/order/countrieslist
    [Route("countrieslist")]
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetCountriesList()
    {
        var countrieslist = await _orderService.GetCountriesForFilter();
        return Ok(countrieslist);
    }
}
