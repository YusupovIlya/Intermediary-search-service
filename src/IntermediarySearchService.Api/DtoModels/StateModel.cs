using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Entities.OrderAggregate;

namespace IntermediarySearchService.Api.DtoModels;

public class StateModel
{
    public int Id { get; set; }
    public string State { get; set; }
    public string? Description { get; set; }
    public string? Date { get; set; }

    public StateModel(OfferState id, string state, string? date)
    {
        Id = (int)id;
        State = state;
        Date = date;
    }

    public StateModel(OrderState id, string state, string? description, string? date)
    {
        Id = (int)id;
        State = state;
        Description = description;
        Date = date;
    }
}
