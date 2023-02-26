using UnitTests.Builders;
using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Exceptions;

namespace UnitTests.Core.Entities.OrderTests;

public class UpdateOrderTests
{
    private OrderBuilder orderBuilder => new OrderBuilder();
    private List<OrderItem> items => new List<OrderItem>
    {
        new OrderItem("pc", "with box", "https://new_shop.com/pc", 2010, 1, "https://new_shop.com/pc.jpg"),
        new OrderItem("memory", "32gb", "https://new_shop.com/memory", 150, 2, "https://new_shop.com/memory.jpg"),
    };
    private string siteName => "newShop";
    private string siteLink => "https://new_shop.com";
    private decimal performerFee => 500m;

    [Fact]
    public void UpdateOrderSuccessfully()
    {
        // arrange
        var order = orderBuilder
                            .WithDefaultValues()
                            .Build();

        // act
        order.Update(siteName, siteLink, performerFee, items);

        // assert
        Assert.True(order.OrderItems.Count == 2);
        Assert.True(order.TotalOrderPrice() == items.Sum(i => i.Units * i.UnitPrice));
        Assert.Equal(siteName, order.SiteName);
        Assert.Equal(siteLink, order.SiteLink);
        Assert.Equal(performerFee, order.PerformerFee);
    }

    [Fact]
    public void CantUpdateOrder()
    {
        // arrange
        var order = orderBuilder
                            .WithDefaultValues()
                            .WithState(OrderState.AwaitingShipment)
                            .Build();

        // act & assert
        Assert.Throws<UpdateOrderException>(() => order.Update(siteName, siteLink, performerFee, items));
    }
}
