
using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Exceptions;
using UnitTests.Builders;

namespace UnitTests.Core.Entities.OrderTests;

public class SetTrackCodeTests
{
    private OrderBuilder orderBuilder => new OrderBuilder();
    private OfferBuilder offerBuilder => new OfferBuilder();
    private string trackCode => "JW123DJSH123";

    [Fact]
    public void TrackCodeSetSuccessfully()
    {
        // arrange
        var offer = offerBuilder
                            .WithValues(2, 1, "user10", 120, 20)
                            .WithSelectStatus(true)
                            .WithState(OfferState.ConfirmedByCreator)
                            .Build();

        var order = orderBuilder
                            .WithOffers(offer)
                            .Build();

        // act
        order.SetTrackCode(trackCode);

        // act & assert
        Assert.Equal(trackCode, order.TrackCode);
        Assert.True(order.GetActiveOffer().StatesOffer.Last().State == OfferState.Shipped);
        Assert.True(order.StatesOrder.Last().State == OrderState.Shipped);
    }

    [Fact]
    public void CantSetTrackCode()
    {
        // arrange
        var offer = offerBuilder
                            .WithValues(2, 1, "user10", 120, 20)
                            .WithSelectStatus(true)
                            .WithState(OfferState.Confirmed)
                            .Build();

        var order = orderBuilder
                            .WithOffers(offer)
                            .Build();

        // act & assert
        Assert.Throws<SetTrackCodeException>(() => order.SetTrackCode(trackCode));
    }
}
