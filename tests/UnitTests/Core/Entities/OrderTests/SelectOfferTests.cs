using UnitTests.Builders;
using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Exceptions;

namespace UnitTests.Core.Entities.OrderTests;

public class SelectOfferTests
{
    private OrderBuilder orderBuilder => new OrderBuilder();
    private OfferBuilder offerBuilder => new OfferBuilder();

    [Fact]
    public void OfferSelectedSuccessfully()
    {
        // arrange
        var offer = offerBuilder
                            .WithDefaultValues()
                            .Build();

        var order = orderBuilder
                            .WithOffers(offer)
                            .Build();

        // act
        order.SelectOffer(offer.Id);

        // assert
        Assert.True(offer.StatesOffer.Last().State == OfferState.Confirmed);
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
        Assert.Throws<SelectOfferException>(() => order.SelectOffer(offer.Id));
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
        Assert.Throws<OfferNotFoundException>(() => order.SelectOffer(offer.Id));
    }
}
