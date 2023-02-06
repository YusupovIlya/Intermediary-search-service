using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Interfaces;
using IntermediarySearchService.Core.Specifications;
using IntermediarySearchService.Core.Exceptions;
using System.Linq;

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

    public async Task<IEnumerable<Order>> GetUserOrdersAsync(string userName, State[] orderStates,
                                                             string[] shops, string? sortBy)
    {
        var orderSpec = new OrdersWithItemsSpecification(userName);
        var orders = await _orderRepository.ListAsync(orderSpec);
        if (shops.Length > 0) orders = orders.Where(o => shops.Contains(o.SiteName)).ToList();
        if(orderStates.Length > 0) orders = orders.Where(o => orderStates.Contains((State)o.StatesOrder.Last()?.State)).ToList();
        return SortByParam(sortBy, orders);
    }

    public async Task DeleteAsync(int orderId, string initatorUserName)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order != null)
        {
            if (order.UserName == initatorUserName)
                await _orderRepository.DeleteAsync(order);
            else
                throw new ForbiddenActionException(initatorUserName);
        }
        else
            throw new OrderNotFoundException(orderId);
    }

    public async Task UpdateAsync(string initatorUserName, int orderId, string siteName, string siteLink, 
                                  Address address, decimal performerFee, List<OrderItem> orderItems)
    {
        var order = await GetByIdAsync(orderId);
        if (order != null)
        {
            if (order.UserName == initatorUserName)
            {
                order.Update(siteName, siteLink, address, performerFee, orderItems);
                await _orderRepository.UpdateAsync(order);
            }
            else
                throw new ForbiddenActionException(initatorUserName);
        }
        else
            throw new OrderNotFoundException(orderId);
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


    public IEnumerable<Order> SortByParam(string? param, IEnumerable<Order> orders) =>
        param switch
        {
            newest => orders.OrderByDescending(o => o.StatesOrder.First().Date),
            oldest => orders.OrderBy(o => o.StatesOrder.First().Date),
            minMax => orders.OrderBy(o => o.TotalOrderPrice()),
            maxMin => orders.OrderByDescending(o => o.TotalOrderPrice()),
            _ => orders,
        };

    public async Task<string?[]> GetParam(FilterParam type, string userName) =>
        type switch
        {
            FilterParam.AllShops => await GetShopsForFilter(),
            FilterParam.UserShops => await GetShopsForFilter(userName),
            FilterParam.AllCountries => await GetCountriesForFilter(),
            _ => new string[0],
        };

    public async Task<int> SelectOfferForOrderByIdAsync(int orderId, int offerId)
    {
        var order = await GetByIdAsync(orderId);
        order.SelectOffer(offerId);
        await _orderRepository.UpdateAsync(order);
        return offerId;
    }
}

public enum FilterParam
{
    AllShops,
    AllCountries,
    UserShops,
}
