using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Services;
using IntermediarySearchService.Core.Exceptions;

namespace IntermediarySearchService.Core.Interfaces;

public interface IOrderService
{
    /// <summary>
    /// Creates new order
    /// </summary>
    /// <param name="userName">creator username</param>
    /// <param name="siteName">web site name</param>
    /// <param name="siteLink">web site link</param>
    /// <param name="performerFee">fee for performer</param>
    /// <param name="orderItems">list of order items</param>
    /// <param name="address">place where is need to deliver</param>
    /// <param name="isBuyingByMyself">customer can buy order by himself</param>
    /// <returns>Created order id</returns>
    Task<int> CreateAsync(string userName, string siteName, string siteLink, decimal performerFee, 
                          List<OrderItem> orderItems, Address address, bool isBuyingByMyself);

    /// <summary>
    /// Get order by id
    /// </summary>
    /// <param name="id">order id</param>
    /// <exception cref="OrderNotFoundException"></exception>
    /// <returns>Order by its id</returns>
    Task<Order> GetByIdAsync(int id);

    /// <summary>
    /// Get user orders by order states
    /// </summary>
    /// <param name="userName">username</param>
    /// <param name="orderStates">array of order states</param>
    /// <param name="shops">array of shop names</param>
    /// <param name="sortBy">sorting type</param>
    /// <returns>User orders by params</returns>
    Task<IEnumerable<Order>> GetUserOrdersAsync(string userName, OrderState[] orderStates, 
                                                string[] shops, string? sortBy);

    /// <summary>
    /// Deletes order by id
    /// </summary>
    /// <param name="id">order id</param>
    /// <exception cref="OrderNotFoundException"></exception>
    /// <exception cref="DeleteOrderException"></exception>
    Task DeleteAsync(int id);

    /// <summary>
    /// Updates order
    /// </summary>
    /// <exception cref="OrderNotFoundException"></exception>
    /// <exception cref="UpdateOrderException"></exception>
    Task UpdateAsync(int id, string siteName, string siteLink, 
                     decimal performerFee, List<OrderItem> orderItems);

    /// <summary>
    /// Get param for filter by type
    /// </summary>
    /// <param name="type">type of param</param>
    /// <param name="userName">user name</param>
    /// <returns>string array</returns>
    Task<string?[]> GetParamAsync(FilterParam type, string userName);

    /// <summary>
    /// Adds track code to order
    /// </summary>
    /// <param name="id">order id</param>
    /// <param name="trackCode"></param>
    /// <exception cref="OrderNotFoundException"></exception>
    /// <exception cref="SetTrackCodeException"></exception>
    Task SetTrackCodeAsync(int id, string trackCode);

    /// <summary>
    /// Close order by its id
    /// </summary>
    /// <param name="id">order id</param>
    /// <exception cref="OrderNotFoundException"></exception>
    /// <exception cref="CloseOrderException"></exception>
    Task CloseAsync(int id);

    /// <summary>
    /// Selects offer for order by these ids
    /// </summary>
    /// <param name="id">order id</param>
    /// <param name="offerId">offer id</param>
    /// <exception cref="OrderNotFoundException"></exception>
    /// <exception cref="OfferNotFoundException"></exception>
    /// <exception cref="SelectOfferException"></exception>
    Task SelectOfferAsync(int id, int offerId);

    /// <summary>
    /// Get paginated order list
    /// </summary>
    /// <param name="pageNumber">number of page</param>
    /// <param name="pageSize">size of page</param>
    /// <param name="shops">array of shop names</param>
    /// <param name="countries">array of countries</param>
    /// <param name="numOrderItems">number of order items</param>
    /// <param name="minOrderPrice">min order price</param>
    /// <param name="maxOrderPrice">max order price</param>
    /// <param name="sortBy">sorting type</param>
    /// <returns></returns>
    Task<PagedList<Order>> GetOrdersByPageNumberAsync(int pageNumber, int pageSize, 
                                                      string[] shops, string[] countries, 
                                                      int? numOrderItems, int? minOrderPrice, 
                                                      int? maxOrderPrice, string? sortBy);
}
