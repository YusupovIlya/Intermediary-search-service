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
    [Route("all")]
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        //var orders = await _orderService.GetAllAsync(GetUserName());
        var orders = await _orderService.GetAllAsync("usr1");
        var mappedOrders = _mapper.Map<IEnumerable<OrderModel>>(orders);
        return Ok(mappedOrders);
    }

    // GET api/v1/order/5
    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var order = await _orderService.GetByIdAsync(id);
        var orderDto = _mapper.Map<OrderModel>(order);
        return Ok(orderDto);
    }

    // POST api/v1/order/create
    [Route("create")]
    [HttpPost]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> CreateOrder([FromBody] NewOrderModel order)
    {
        int orderId = await _orderService.CreateAsync("ilya", order.SiteName, order.SiteLink,
                                        order.PerformerFee, order.OrderItems);
        var response = new ResponseModel(orderId.ToString(), "Order was successfully created");
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
}
