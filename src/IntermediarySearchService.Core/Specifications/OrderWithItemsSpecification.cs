using Ardalis.Specification;
using IntermediarySearchService.Core.Entities.OrderAggregate;

namespace IntermediarySearchService.Core.Specifications;

public sealed class OrderWithItemsSpecification : Specification<Order>, ISingleResultSpecification
{
    public OrderWithItemsSpecification(int id)
    {
        Query
            .Where(o => o.Id == id)
            .Include(o => o.Offers)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Images);
    }
}
