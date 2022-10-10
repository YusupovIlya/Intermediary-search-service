﻿using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Interfaces;

namespace IntermediarySearchService.Core.Entities.OfferAggregate;

public class Offer: BaseEntity, IAggregateRoot
{
    public int OrderId { get; private set; }
    public Order? Order { get; private set; }
    public string UserId { get; private set; }
    public decimal ItemsTotalCost { get; private set; }
    public decimal DeliveryCost { get; private set; }
    public decimal? Expenses { get; private set; }
    public bool isSelected { get; private set; } = false;

    public Offer(int orderId, string userId, decimal itemsTotalCost,
                 decimal deliveryCost, decimal expenses = 0m)
    {
        OrderId = orderId;
        UserId = userId;
        ItemsTotalCost = itemsTotalCost;
        DeliveryCost = deliveryCost;
        Expenses = expenses;
    }

    public void ChangeSelectStatus(bool state) => isSelected = state;
}
