using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Exceptions;
using UnitTests.Builders;

namespace UnitTests.Core.Entities.OfferTests;

public class UpdateOfferTests
{
    private OfferBuilder offerBuilder => new OfferBuilder();
    private decimal itemsTotalCost => 1500m;
    private decimal deliveryCost => 20m;

    [Fact]
    public void UpdateOrderSuccessfully()
    {
        // arrange
        var offer = offerBuilder
                            .WithDefaultValues()
                            .Build();

        // act
        offer.Update(itemsTotalCost, deliveryCost, null, null);

        // assert
        Assert.True(offer.ItemsTotalCost == itemsTotalCost);
        Assert.True(offer.DeliveryCost == deliveryCost);
    }

    [Fact]
    public void CantUpdateOffer()
    {
        // arrange
        var offer = offerBuilder
                            .WithDefaultValues()
                            .WithState(OfferState.Confirmed)
                            .Build();

        // act & assert
        Assert.Throws<UpdateOfferException>(() => offer.Update(itemsTotalCost, deliveryCost, null, null));
    }
}
