
using System.ComponentModel;

namespace IntermediarySearchService.Core.Entities.OfferAggregate;

public class StateOffer
{
    public OfferState State { get; private set; }
    public DateTime? Date { get; private set; }
    public StateOffer(OfferState state, DateTime? date)
    {
        State = state;
        Date = date;
    }
}

public enum OfferState
{
    [Description("Sent to the customer")] SentToCustomer,
    [Description("Canceled by the customer")] Canceled,
    [Description("Canceled by myself")] CanceledByCreator,
    [Description("Confirmed by the customer")] Confirmed,
    [Description("Confirmed by the creator")] ConfirmedByCreator,
    [Description("Shipped")] Shipped,
    [Description("Completed")] Completed
}