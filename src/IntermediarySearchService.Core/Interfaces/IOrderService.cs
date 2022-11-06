using IntermediarySearchService.Core.Entities.OrderAggregate;
using System.Threading.Tasks;

namespace IntermediarySearchService.Core.Interfaces;

public interface IOrderService
{
    Task CreateAsync(string userName, string siteName, string siteLink,
                     decimal performerFee, List<OrderItem> orderItems);

    Task<Order> GetByIdAsync(int orderId);

    Task<IEnumerable<Order>> GetAllAsync(string userName);

    Task AddItemsAsync(int orderId, List<OrderItem> items);

    Task DeleteItemsAsync(int orderId, int[] itemsId);

    Task DeleteAsync(int orderId);

    Task UpdateAsync(Order order);
}
