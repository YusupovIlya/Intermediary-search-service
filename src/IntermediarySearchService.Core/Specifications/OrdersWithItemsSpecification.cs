﻿using Ardalis.Specification;
using IntermediarySearchService.Core.Entities.OrderAggregate;
using System.Linq.Expressions;

namespace IntermediarySearchService.Core.Specifications;

public sealed class OrdersWithItemsSpecification : Specification<Order>
{
    public OrdersWithItemsSpecification()
    {
        Query
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Images);
    }

    public OrdersWithItemsSpecification(string userName)
    {
        Query
            .Where(o => o.UserName == userName)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Images);
    }
}
