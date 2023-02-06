﻿using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Interfaces;

namespace IntermediarySearchService.Core.Entities.OfferAggregate;

public class Offer: BaseEntity, IAggregateRoot
{
    public int OrderId { get; private set; }
    public string UserName { get; private set; }
    public decimal ItemsTotalCost { get; private set; }
    public decimal DeliveryCost { get; private set; }
    public decimal? Expenses { get; private set; }
    public bool isSelected { get; private set; } = false;
    public string? Comment { get; set; }

    private Offer() { }

    public Offer(int orderId, string userName, decimal itemsTotalCost,
                 decimal deliveryCost, decimal? expenses = 0m, string? comment = null)
    {
        OrderId = orderId;
        UserName = userName;
        ItemsTotalCost = itemsTotalCost;
        DeliveryCost = deliveryCost;
        Expenses = expenses;
        Comment = comment;
    }

    public void ChangeSelectStatus(bool state) => isSelected = state;
}
