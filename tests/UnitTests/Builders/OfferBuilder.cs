using IntermediarySearchService.Core.Constants;
using IntermediarySearchService.Core.Entities.OfferAggregate;

namespace UnitTests.Builders;

public class OfferBuilder
{
    private Offer _offer;
    public int id = 1;
    public int orderId = 1;
    public string userName => AuthConstants.EMAIL;
    public decimal itemsTotalCost => 250.25m;
    public decimal deliveryCost => 25.5m;
    public bool isSelected => false;

    public OfferBuilder()
    {
        WithDefaultValues();
    }

    public Offer Build()
    {
        return _offer;
    }

    public OfferBuilder WithDefaultValues()
    {
        _offer = new Offer(id, orderId, userName, itemsTotalCost, deliveryCost);
        return this;
    }

    public OfferBuilder WithValues(int id, int orderId, string userName, decimal itemsTotalCost, decimal deliveryCost)
    {
        _offer = new Offer(id, orderId, userName, itemsTotalCost, deliveryCost);
        return this;
    }

    public OfferBuilder WithState(OfferState state)
    {
        _offer.AddStateOffer(state);
        return this;
    }

    public OfferBuilder WithSelectStatus(bool selected)
    {
        _offer.ChangeSelectStatus(selected);
        return this;
    }
}
