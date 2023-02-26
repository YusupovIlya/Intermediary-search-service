using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Exceptions;
using UnitTests.Builders;

namespace UnitTests.Core.Entities.OfferTests;

public class RemoveOfferTests
{
    private OfferBuilder offerBuilder => new OfferBuilder();
    private decimal itemsTotalCost => 1500m;
    private decimal deliveryCost => 20m;

    [Fact]
    public void RemoveOrderSuccessfully()
    {
        // arrange
        var offer = offerBuilder
                            .WithDefaultValues()
                            .Build();

        // act
        offer.Remove();

        // assert
        Assert.True(offer.Deleted != null);
    }

    [Fact]
    public void CantRemoveOffer()
    {
        // arrange
        var offer = offerBuilder
                            .WithDefaultValues()
                            .WithState(OfferState.Confirmed)
                            .Build();

        // act & assert
        Assert.Throws<DeleteOfferException>(() => offer.Remove());
    }
}
