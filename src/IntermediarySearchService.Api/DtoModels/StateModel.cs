using IntermediarySearchService.Core.Entities.OrderAggregate;

namespace IntermediarySearchService.Api.DtoModels;

public class StateModel
{
    public State Id { get; set; }
    public string State { get; set; }
    public string? Description { get; set; }
    public string? Date { get; set; }

    public StateModel(State id, string state, string? description, string? date)
    {
        Id = id;
        State = state;
        Description = description;
        Date = date;
    }
}
