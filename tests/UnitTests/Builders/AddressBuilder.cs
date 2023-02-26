using IntermediarySearchService.Core.Entities.OrderAggregate;

namespace UnitTests.Builders;

public class AddressBuilder
{
    private Address _address;
    public string postalCode => "4214";
    public string city => "Gelderland";
    public string country => "Netherlands";
    public string label => "4214, Vuren, GE, Netherlands";

    public AddressBuilder()
    {
        _address = WithDefaultValues();
    }
    public Address Build()
    {
        return _address;
    }
    public Address WithDefaultValues()
    {
        _address = new Address(postalCode, country, city, label);
        return _address;
    }
}
