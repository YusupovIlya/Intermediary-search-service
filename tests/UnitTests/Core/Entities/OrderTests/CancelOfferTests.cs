using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Exceptions;
using UnitTests.Builders;

namespace UnitTests.Core.Entities.OrderTests;

public class CancelOfferTests
{
    private OrderBuilder orderBuilder => new OrderBuilder();
    private OfferBuilder offerBuilder => new OfferBuilder();
    [Fact]
    public void OfferCanceldSuccessfully()
    {
        // arrange
        var offer = offerBuilder
                            .WithDefaultValues()
                            .Build();

        var order = orderBuilder
                            .WithOffers(offer)
                            .Build();

        // act
        order.CancelOffer(offer.Id);

        // assert
        Assert.True(offer.StatesOffer.Last().State == OfferState.CanceledByCreator);
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
        Assert.Throws<OfferNotFoundException>(() => order.CancelOffer(offer.Id));
    }
}
