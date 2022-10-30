using Ardalis.Specification;
using IntermediarySearchService.Core.Entities.OrderAggregate;

namespace IntermediarySearchService.Core.Specifications;

public sealed class OrdersWithItemsSpecification : Specification<Order>
{
    public OrdersWithItemsSpecification(string userName)
    {
        Query
            .Where(o => o.UserName == userName)
            .Include(o => o.OrderItems);
    }
}
