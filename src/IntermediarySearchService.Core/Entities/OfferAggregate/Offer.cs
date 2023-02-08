using IntermediarySearchService.Core.Interfaces;

namespace IntermediarySearchService.Core.Entities.OfferAggregate;

public class Offer: BaseEntity, IAggregateRoot
{
    public int OrderId { get; private set; }
    public string UserName { get; private set; }
    public decimal ItemsTotalCost { get; private set; }
    public decimal DeliveryCost { get; private set; }
    public decimal? Expenses { get; private set; }
    public bool isSelected { get; private set; } = false;
    public string? Comment { get; set; }

    private readonly List<StateOffer> _statesOffer = new List<StateOffer>();
    public IReadOnlyCollection<StateOffer> StatesOffer => _statesOffer.AsReadOnly();

    private Offer() { }

    public Offer(int orderId, string userName, decimal itemsTotalCost,
                 decimal deliveryCost, decimal? expenses = 0m, string? comment = null)
    {
        OrderId = orderId;
        UserName = userName;
        ItemsTotalCost = itemsTotalCost;
        DeliveryCost = deliveryCost;
        Expenses = expenses;
        Comment = comment;
        AddStateOffer();
    }

    public void ChangeSelectStatus(bool state)
    {
        if (state)
        {
            AddStateOffer(OfferState.Confirmed);
            isSelected = true;
        }
        else
        {
            var selectedStatus = _statesOffer.FirstOrDefault(s => s.State == OfferState.Confirmed);
            if (selectedStatus != null) _statesOffer.Remove(selectedStatus);
            isSelected = false;
        }
    }


    public void AddStateOffer(OfferState stateOffer = OfferState.SentToCustomer)
    {
        StateOffer newState = new StateOffer(stateOffer, DateTime.Now);
        _statesOffer.Add(newState);
    }
}
