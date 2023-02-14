﻿using Ardalis.Specification;
using IntermediarySearchService.Core.Entities.OrderAggregate;

namespace IntermediarySearchService.Core.Specifications;

public sealed class OrdersWithItemsSpecification : Specification<Order>
{
    public OrdersWithItemsSpecification()
    {
        Query
            .Include(o => o.OrderItems)
            .Where(o => o.StatesOrder
                                .OrderBy(s => s.Date)
                                .Last().State == OrderState.InSearchPerformer);
    }

    public OrdersWithItemsSpecification(string userName)
    {
        Query
            .Where(o => o.UserName == userName)
            .Include(o => o.Offers)
            .Include(o => o.OrderItems);
    }
}
