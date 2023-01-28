namespace IntermediarySearchService.Api.DtoModels;

public class OrdersFilterModel
{
    public string[]? Shops { get; set; }
    public string[]? Countries { get; set; }
    public int NumOrderItems { get; set; }
    public int MinOrderPrice { get; set; }
    public int MaxOrderPrice { get; set; }
}
