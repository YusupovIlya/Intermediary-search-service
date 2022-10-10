namespace IntermediarySearchService.Core.Entities.OrderAggregate;

public class OrderItem: BaseEntity
{
    public string ProductName { get; private set; }
    public string Options { get; private set; }
    public string ProductLink { get; private set; }
    public decimal UnitPrice { get; private set; }
    public int Units { get; private set; }

    public OrderItem(string productName, string options, string productLink, decimal unitPrice, int units)
    {
        ProductName = productName;
        Options = options;
        ProductLink = productLink;
        UnitPrice = unitPrice;
        Units = units;
    }
}
