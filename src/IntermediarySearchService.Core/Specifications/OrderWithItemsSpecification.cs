using Ardalis.Specification;
using IntermediarySearchService.Core.Entities.OrderAggregate;

namespace IntermediarySearchService.Core.Specifications;

public sealed class OrderWithItemsSpecification : Specification<Order>, ISingleResultSpecification
{
    public OrderWithItemsSpecification(int orderId)
    {
        Query
            .Where(o => o.Id == orderId)
            .Include(o => o.OrderItems);
    }
}
