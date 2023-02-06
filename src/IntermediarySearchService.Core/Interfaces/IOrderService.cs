using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Services;
using System.Threading.Tasks;

namespace IntermediarySearchService.Core.Interfaces;

public interface IOrderService
{
    Task<int> CreateAsync(string userName, string siteName, string siteLink,
                     decimal performerFee, List<OrderItem> orderItems, Address address);

    Task<Order> GetByIdAsync(int orderId);

    Task<IEnumerable<Order>> GetUserOrdersAsync(string userName, State[] orderStates, 
                                                string[] shops, string? sortBy);

    Task DeleteAsync(int orderId, string initatorUserName);

    Task UpdateAsync(string initatorUserName, int orderId, string siteName, string siteLink, 
                     Address address, decimal performerFee, List<OrderItem> orderItems);

    Task<string?[]> GetParam(FilterParam type, string userName);

    Task<int> SelectOfferForOrderByIdAsync(int orderId, int offerId);

    Task<PagedList<Order>> GetOrdersByPageNumberAsync(int pageNumber, int pageSize, 
                                                      string[] shops, string[] countries, 
                                                      int? numOrderItems, int? minOrderPrice, 
                                                      int? maxOrderPrice, string? sortBy);
}
