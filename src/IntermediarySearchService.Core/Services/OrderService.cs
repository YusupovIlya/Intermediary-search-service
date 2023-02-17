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

    public async Task<int> CreateAsync(string userName, string siteName, string siteLink, decimal performerFee,
                                       List<OrderItem> orderItems, Address address, bool isBuyingByMyself)
    {
        var order = new Order(userName, siteName, siteLink, performerFee, orderItems, address, isBuyingByMyself);
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

    public async Task<IEnumerable<Order>> GetUserOrdersAsync(string userName, OrderState[] orderStates,
                                                             string[] shops, string? sortBy)
    {
        var orderSpec = new OrdersWithItemsSpecification(userName);
        var orders = await _orderRepository.ListAsync(orderSpec);
        if (shops.Length > 0) orders = orders.Where(o => shops.Contains(o.SiteName)).ToList();
        if(orderStates.Length > 0) orders = orders.Where(o => orderStates.Contains((OrderState)o.StatesOrder.Last()?.State)).ToList();
        return SortByParam(sortBy, orders);
    }

    public async Task DeleteAsync(int id)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order != null)
        {
            if (order.isDeletable)
                await _orderRepository.DeleteAsync(order);
            else
                throw new DeleteOrderException(id);
        }
        else
            throw new OrderNotFoundException(id);
    }

    public async Task UpdateAsync(int id, string siteName, string siteLink, 
                                  decimal performerFee, List<OrderItem> orderItems)
    {
        var order = await GetByIdAsync(id);
        if (order != null)
        {
            order.Update(siteName, siteLink, performerFee, orderItems);
            await _orderRepository.UpdateAsync(order);
        }
        else
            throw new OrderNotFoundException(id);
    }

    public async Task<string[]> GetShopsForFilter(string userName = null)
    {
        List<Order> orders;
        if(userName == null)
            orders = await _orderRepository.ListAsync();
        else
        {
            var orderSpec = new OrdersWithItemsSpecification(userName);
            orders = await _orderRepository.ListAsync(orderSpec);
        }
        return orders.DistinctBy(order => order.SiteName)
                     .Select(i => i.SiteName)
                     .ToArray();
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

        filtered = SortByParam(sortBy, filtered);
        var paginatedOrders = PagedList<Order>.ToPagedList(filtered, pageNumber, pageSize);
        return paginatedOrders;
    }


    private IEnumerable<Order> SortByParam(string? param, IEnumerable<Order> orders) =>
        param switch
        {
            newest => orders.OrderByDescending(o => o.StatesOrder.First().Date),
            oldest => orders.OrderBy(o => o.StatesOrder.First().Date),
            minMax => orders.OrderBy(o => o.TotalOrderPrice()),
            maxMin => orders.OrderByDescending(o => o.TotalOrderPrice()),
            _ => orders,
        };

    public async Task<string?[]> GetParamAsync(FilterParam type, string userName) =>
        type switch
        {
            FilterParam.AllShops => await GetShopsForFilter(),
            FilterParam.UserShops => await GetShopsForFilter(userName),
            FilterParam.AllCountries => await GetCountriesForFilter(),
            _ => new string[0],
        };

    public async Task SetTrackCodeAsync(int orderId, string trackCode)
    {
        var order = await GetByIdAsync(orderId);
        order.SetTrackCode(trackCode);
        await _orderRepository.UpdateAsync(order);
    }

    public async Task SelectOfferAsync(int orderId, int offerId)
    {
        var order = await GetByIdAsync(orderId);
        order.SelectOffer(offerId);
        await _orderRepository.UpdateAsync(order);
    }

    public async Task CloseAsync(int id)
    {
        var order = await GetByIdAsync(id);
        order.CloseOrder();
        await _orderRepository.UpdateAsync(order);
    }

    public async Task DeleteUserOrdersAsync(string userName)
    {
        var orders = await GetUserOrdersAsync(userName, new OrderState[0], new string[0], null);
        await _orderRepository.DeleteRangeAsync(orders);
    }
}

public enum FilterParam
{
    AllShops,
    AllCountries,
    UserShops,
}
