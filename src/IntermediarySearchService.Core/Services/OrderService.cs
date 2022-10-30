using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Interfaces;
using IntermediarySearchService.Core.Specifications;
using IntermediarySearchService.Core.Exceptions;

namespace IntermediarySearchService.Core.Services;

public class OrderService : IOrderService
{
    private readonly IRepository<Order> _orderRepository;
    public OrderService(IRepository<Order> orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task CreateAsync(string userName, string siteName, string siteLink, decimal performerFee, List<OrderItem> orderItems)
    {
        var order = new Order(userName, siteName, siteLink, performerFee, orderItems);
        await _orderRepository.AddAsync(order);
    }

    public async Task<Order> GetByIdAsync(int orderId)
    {
        var orderSpec = new OrderWithItemsSpecification(orderId);
        var order = await _orderRepository.FirstOrDefaultAsync(orderSpec);
        if (order != null)
            return order;
        else
            throw new OrderNotFoundException(orderId);
    }

    public async Task<IEnumerable<Order>> GetAllAsync(string userName)
    {
        var orderSpec = new OrdersWithItemsSpecification(userName);
        var orders = await _orderRepository.ListAsync(orderSpec);
        return orders;
    }

    public async Task AddItemsAsync(int orderId, List<OrderItem> items)
    {
        var orderSpec = new OrderWithItemsSpecification(orderId);
        var order = await _orderRepository.FirstOrDefaultAsync(orderSpec);
        if(order != null)
        {
            items.ForEach(i => order.AddItem(i));
            await _orderRepository.SaveChangesAsync();
        }
        else
            throw new OrderNotFoundException(orderId);
    }

    public async Task DeleteAsync(int orderId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order != null)
        {
            await _orderRepository.DeleteAsync(order);
        }
        else
            throw new OrderNotFoundException(orderId);
    }

    public async Task DeleteItemsAsync(int orderId, int[] itemsId)
    {
        var orderSpec = new OrderWithItemsSpecification(orderId);
        var order = await _orderRepository.FirstOrDefaultAsync(orderSpec);
        if (order != null)
        {
            Array.ForEach(itemsId, i => order.DeleteItem(i));
            await _orderRepository.SaveChangesAsync();
        }
        else
            throw new OrderNotFoundException(orderId);
    }
}
