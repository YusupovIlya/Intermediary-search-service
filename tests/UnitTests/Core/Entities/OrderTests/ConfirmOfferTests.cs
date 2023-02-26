

using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Exceptions;
using UnitTests.Builders;

namespace UnitTests.Core.Entities.OrderTests;

public class ConfirmOfferTests
{
    private OrderBuilder orderBuilder => new OrderBuilder();
    private OfferBuilder offerBuilder => new OfferBuilder();

    [Fact]
    public void OfferConfirmedSuccessfully()
    {
        // arrange
        var offer = offerBuilder
                            .WithDefaultValues()
                            .WithSelectStatus(true)
                            .Build();

        var order = orderBuilder
                            .WithOffers(offer)
                            .Build();

        // act
        order.ConfirmOffer(offer.Id);

        // assert
        Assert.True(offer.StatesOffer.Last().State == OfferState.ConfirmedByCreator);
        Assert.True(order.StatesOrder.Last().State == OrderState.AwaitingShipment);
        Assert.True(order.HasConfirmedOffer);
        Assert.True(offer.Equals(order.GetActiveOffer()));
    }


    [Fact]
    public void OrderAlreadyHasConfirmedOffer()
    {
        // arrange
        var offer = offerBuilder
                            .WithDefaultValues()
                            .Build();

        var confirmedOffer = offerBuilder
                                .WithValues(2, 1, "user10", 120, 20)
                                .WithSelectStatus(true)
                                .WithState(OfferState.ConfirmedByCreator)
                                .Build();

        var order = orderBuilder
                            .WithOffers(offer, confirmedOffer)
                            .Build();

        // act & assert
        Assert.Throws<ConfirmOfferException>(() => order.ConfirmOffer(offer.Id));
    }

    [Fact]
    public void OfferWithIdNotFound()
    {
        // arrange
        var offer = offerBuilder
                            .WithDefaultValues()
                            .Build();

        var order = orderBuilder
                            .WithDefaultValues()
                            .Build();

        // act & assert
        Assert.Throws<OfferNotFoundException>(() => order.ConfirmOffer(offer.Id));
    }
}
