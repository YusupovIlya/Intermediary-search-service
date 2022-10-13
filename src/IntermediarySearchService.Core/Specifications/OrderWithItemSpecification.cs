using Ardalis.Specification;
using IntermediarySearchService.Core.Entities.OrderAggregate;

namespace IntermediarySearchService.Core.Specifications;

public sealed class OrderWithItemSpecification : Specification<Order>, ISingleResultSpecification
{
    public OrderWithItemSpecification(int orderId)
    {
        Query
            .Where(o => o.Id == orderId)
            .Include(o => o.OrderItems);
    }

    //public OrderWithItemSpecification(string userName)
    //{
    //    Query
    //        .Where(o => o.UserName == userName)
    //        .Include(o => o.OrderItems);
    //}
}
