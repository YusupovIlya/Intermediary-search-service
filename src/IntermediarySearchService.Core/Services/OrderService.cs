using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Interfaces;
using IntermediarySearchService.Core.Specifications;
using IntermediarySearchService.Core.Exceptions;

namespace IntermediarySearchService.Core.Services;

public class OrderService : IOrderService
{
    private readonly IRepository<Order> _orderRepository;
    private const string maxMin = "maxmin";
    private const string minMax = "minmax";
    private const string newest = "newest";
    private const string oldest = "oldest";
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
                                                                   int? numOrderItems, int? minOrderPrice,
                                                                   int? maxOrderPrice, string? sortBy)
    {
        var orderSpec = new OrdersWithItemsSpecification();
        var orders = await _orderRepository.ListAsync(orderSpec);

        Func<Order, bool> checkIntParams = (order) => {
            bool res = true;
            if (numOrderItems != null) res = res && order.OrderItems.Count <= numOrderItems;
            if (minOrderPrice != null && maxOrderPrice != null) 
                res = res && order.TotalOrderPrice() >= minOrderPrice && order.TotalOrderPrice() <= maxOrderPrice;
            return res;
        };

        var filtered = (shops.Length == 0, countries.Length == 0) switch
            {
                (false, true) => orders.Where(o => shops.Contains(o.SiteName) && checkIntParams(o)),

                (true, false) => orders.Where(o => countries.Contains(o.Address.Country) && checkIntParams(o)),

                (false, false) => orders.Where(o => shops.Contains(o.SiteName) &&
                                                    countries.Contains(o.Address.Country) &&
                                                    checkIntParams(o)),

                (true, true) => orders.Where(o => checkIntParams(o)),
            };

        if(sortBy != null)
        {
            switch (sortBy)
            {
                case newest:
                    filtered = filtered.OrderBy(o => o.StatesOrder.FirstOrDefault(s => s.State == State.InSearchPerformer)?.Date);
                    break;
                case oldest:
                    filtered = filtered.OrderByDescending(o => o.StatesOrder.FirstOrDefault(s => s.State == State.InSearchPerformer)?.Date);
                    break;
                case maxMin:
                    filtered = filtered.OrderBy(o => o.TotalOrderPrice());
                    break;
                case minMax:
                    filtered = filtered.OrderByDescending(o => o.TotalOrderPrice());
                    break;
            }
        }

        var paginatedOrders = PagedList<Order>.ToPagedList(filtered, pageNumber, pageSize);
        return paginatedOrders;
    }
}
