using IntermediarySearchService.Core.Entities.OrderAggregate;

namespace IntermediarySearchService.Api.DtoModels;

public class NewOrderModel
{
    public Address Address { get; set; }
    public string SiteName { get; set; }
    public string SiteLink { get; set; }
    public decimal PerformerFee { get; set; }
    public List<OrderItem> OrderItems { get; set; }
}

public class EditedOrderModel: NewOrderModel { }
