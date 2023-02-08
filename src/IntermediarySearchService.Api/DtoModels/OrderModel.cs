﻿using IntermediarySearchService.Core.Entities.OrderAggregate;

namespace IntermediarySearchService.Api.DtoModels;

public class OrderModel : NewOrderModel
{
    public int Id { get; set; }
    public Address Address { get; set; }
    public IEnumerable<StateModel> StatesOrder { get; set; }
    public IEnumerable<OfferModel> Offers { get; set; }
    public decimal TotalPrice { get; set; }
    public bool isEditable { get; set; }
    public bool isDeletable { get; set; }
}
