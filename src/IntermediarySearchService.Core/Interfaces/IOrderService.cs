using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Services;
using System.Threading.Tasks;

namespace IntermediarySearchService.Core.Interfaces;

public interface IOrderService
{
    Task<int> CreateAsync(string userName, string siteName, string siteLink,
                     decimal performerFee, List<OrderItem> orderItems, Address address);

    Task<Order> GetByIdAsync(int orderId);

    Task<IEnumerable<Order>> GetUserOrdersAsync(string userName);

    Task AddItemsAsync(int orderId, List<OrderItem> items);

    Task DeleteItemsAsync(int orderId, int[] itemsId);

    Task DeleteAsync(int orderId);

    Task UpdateAsync(Order order);

    Task<string[]> GetShopsForFilter();

    Task<string?[]> GetCountriesForFilter();

    Task<PagedList<Order>> GetOrdersByPageNumberAsync(int pageNumber, int pageSize, 
                                                      string[] shops, string[] countries, 
                                                      int? numOrderItems, int? minOrderPrice, 
                                                      int? maxOrderPrice, string? sortBy);
}
