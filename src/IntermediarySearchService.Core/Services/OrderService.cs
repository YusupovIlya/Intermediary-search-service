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

    public async Task<int> CreateAsync(string userName, string siteName, string siteLink, 
                                       decimal performerFee, List<OrderItem> orderItems, Address address)
    {
        var order = new Order(userName, siteName, siteLink, performerFee, orderItems, address);
        await _orderRepository.AddAsync(order);
        return order.Id;
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

    public async Task<IEnumerable<Order>> GetUserOrdersAsync(string userName)
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

    public async Task UpdateAsync(Order order)
    {
        await _orderRepository.UpdateAsync(order);
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

    public async Task<string[]> GetShopsForFilter()
    {
        return await _orderRepository
                                    .ListAsync()
                                    .ContinueWith(o => o.Result
                                                            .DistinctBy(order => order.SiteName)
                                                            .Select(i => i.SiteName)
                                                            .ToArray());
    }

    public async Task<string?[]> GetCountriesForFilter()
    {
        return await _orderRepository
                                    .ListAsync()
                                    .ContinueWith(o => o.Result
                                                            .DistinctBy(order => order.Address.Country)
                                                            .Where(order => order.Address.Country != null)
                                                            .Select(i => i.Address.Country)
                                                            .ToArray());
    }

    public async Task<PagedList<Order>> GetOrdersByPageNumberAsync(int pageNumber, int pageSize,
                                                                   string[] shops, string[] countries,
                                                                   int numOrderItems, int minOrderPrice,
                                                                   int maxOrderPrice)
    {
        var orderSpec = new OrdersWithItemsSpecification();
        var orders = await _orderRepository.ListAsync(orderSpec);
        Func<Order, bool> checkIntParams = (order) => order.OrderItems.Count <= numOrderItems &&
                                                      order.TotalOrderPrice() >= minOrderPrice &&
                                                      order.TotalOrderPrice() <= maxOrderPrice;
        var filtered = (shops.Length == 0, countries.Length == 0) switch
            {
                (false, true) => orders.Where(o => shops.Contains(o.SiteName) && checkIntParams(o)),

                (true, false) => orders.Where(o => countries.Contains(o.Address.Country) && checkIntParams(o)),

                (false, false) => orders.Where(o => shops.Contains(o.SiteName) &&
                                                    countries.Contains(o.Address.Country) &&
                                                    checkIntParams(o)),

                (true, true) => orders.Where(o => checkIntParams(o))
            };
        var paginatedOrders = PagedList<Order>.ToPagedList(filtered, pageNumber, pageSize);
        return paginatedOrders;
    }

    public async Task<PagedList<Order>> GetOrdersByPageNumberAsync(int pageNumber, int pageSize)
    {
        var orderSpec = new OrdersWithItemsSpecification();
        var orders = await _orderRepository.ListAsync(orderSpec);
        var paginatedOrders = PagedList<Order>.ToPagedList(orders, pageNumber, pageSize);
        return paginatedOrders;
    }
}
