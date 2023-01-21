namespace IntermediarySearchService.Core.Entities.OrderAggregate;

public class Address
{
    public string PostalCode { get; private set; }
    public string? Country { get; private set; }
    public string? Region { get; private set; }
    public string? Label { get; private set; }
    public Address(string postalCode, string? country, string? region, string? label)
    {
        PostalCode = postalCode;
        Country = country;
        Region = region;
        Label = label;
    }
}
