using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Entities.OrderAggregate;

namespace IntermediarySearchService.Api.DtoModels;

public class OrderModel : NewOrderModel
{
    public int Id { get; set; }
    public Address Address { get; set; }
    public IEnumerable<StateModel> StatesOrder { get; set; }
    public IEnumerable<Offer> Offers { get; set; }
    public decimal TotalPrice { get; set; }
}
