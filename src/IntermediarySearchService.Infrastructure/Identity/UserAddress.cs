using IntermediarySearchService.Core.Entities;

namespace IntermediarySearchService.Infrastructure.Identity;

public class UserAddress : BaseEntity
{
    public string PostalCode { get; private set; }
    public string Country { get; private set; }
    public string City { get; private set; }
    public string Label { get; private set; }

    private UserAddress() { }

    public UserAddress(string postalCode, string country, 
                       string city, string label)
    {
        PostalCode = postalCode;
        Country = country;
        City = city;
        Label = label;
    }
}
