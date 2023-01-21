namespace IntermediarySearchService.Api.DtoModels;

public class StateModel
{
    public string State { get; set; }
    public string? Description { get; set; }
    public string? Date { get; set; }

    public StateModel(string state, string? description, string? date)
    {
        State = state;
        Description = description;
        Date = date;
    }
}
