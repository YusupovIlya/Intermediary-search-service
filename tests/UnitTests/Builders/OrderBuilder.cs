using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Entities.OrderAggregate;

namespace UnitTests.Builders;


public class OrderBuilder
{
    private Order _order;
    public int id = 1;
    public string userName => "user@email.com";
    public string siteName => "onlineShop";
    public string siteLink => "https://shop.com";
    public decimal performerFee => 120.5m;
    public Address address => new AddressBuilder().WithDefaultValues();

    public OrderBuilder()
    {
        WithDefaultValues();
    }

    public Order Build()
    {
        return _order;
    }

    public OrderBuilder WithDefaultValues()
    {
        var orderItem1 = new OrderItem("smartphone", "black 32gb", "https://shop.com/smartphone", 205, 1, "https://shop.com/image.jpg");
        var orderItem2 = new OrderItem("case", "black", "https://shop.com/smartphone_case", 20, 2, "https://shop.com/image_case.jpg");
        var orderItems = new List<OrderItem>() { orderItem1, orderItem2 };
        _order = new Order(id, userName, siteName, siteLink, performerFee, orderItems, address, true);
        return this;
    }

    public OrderBuilder WithOffers(params Offer[] offers)
    {
        _order.AddOffers(offers.ToList());
        return this;
    }

    public OrderBuilder WithState(OrderState state)
    {
        _order.AddStateOrder(state);
        return this;
    }
}
