using IntermediarySearchService.Core.Entities.OrderAggregate;

namespace IntermediarySearchService.Api.DtoModels;

public class NewOrderModel
{
    public string SiteName { get; set; }
    public string SiteLink { get; set; }
    public decimal PerformerFee { get; set; }
    public List<OrderItem> OrderItems { get; set; }
}
