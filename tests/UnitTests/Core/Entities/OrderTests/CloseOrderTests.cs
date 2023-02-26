using UnitTests.Builders;
using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Exceptions;

namespace UnitTests.Core.Entities.OrderTests;

public class CloseOrderTests
{
    private OrderBuilder orderBuilder => new OrderBuilder();
    private OfferBuilder offerBuilder => new OfferBuilder();

    [Fact]
    public void CloseOrderSuccessfully()
    {
        // arrange
        var offer = offerBuilder
                            .WithDefaultValues()
                            .WithSelectStatus(true)
                            .WithState(OfferState.Shipped)
                            .Build();

        var order = orderBuilder
                            .WithState(OrderState.Shipped)
                            .WithOffers(offer)
                            .Build();

        // act
        order.CloseOrder();

        // assert
        Assert.True(offer.StatesOffer.Last().State == OfferState.Completed);
        Assert.True(order.StatesOrder.Last().State == OrderState.Received);
    }

    [Fact]
    public void CantCloseOrder()
    {
        // arrange
        var offer = offerBuilder
                            .WithDefaultValues()
                            .WithSelectStatus(true)
                            .WithState(OfferState.ConfirmedByCreator)
                            .Build();

        var order = orderBuilder
                            .WithState(OrderState.AwaitingShipment)
                            .WithOffers(offer)
                            .Build();

        // act & assert
        Assert.Throws<CloseOrderException>(() => order.CloseOrder());
    }
}
