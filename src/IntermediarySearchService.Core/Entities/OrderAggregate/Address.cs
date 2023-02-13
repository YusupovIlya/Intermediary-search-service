namespace IntermediarySearchService.Core.Entities.OrderAggregate;

public class Address
{
    public string PostalCode { get; private set; }
    public string Country { get; private set; }
    public string City { get; private set; }
    public string Label { get; private set; }
    private Address() { }
    public Address(string postalCode, string country, string city, string label)
    {
        PostalCode = postalCode;
        Country = country;
        City = city;
        Label = label;
    }
}
