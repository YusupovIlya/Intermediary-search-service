using IntermediarySearchService.Core.Exceptions;
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
    public DateTime? Deleted { get; private set; } = null;

    private readonly List<StateOffer> _statesOffer = new List<StateOffer>();
    public IReadOnlyCollection<StateOffer> StatesOffer => _statesOffer.AsReadOnly();

    public bool isEditable => _statesOffer.Last().State == OfferState.SentToCustomer;

    public bool isDeletable =>
        _statesOffer.Last().State != OfferState.Confirmed &&
        _statesOffer.Last().State != OfferState.ConfirmedByCreator &&
        _statesOffer.Last().State != OfferState.Shipped;

    public bool isNeedConfirmation => _statesOffer.Last().State == OfferState.Confirmed;

    public bool isNeedTrackNumber => _statesOffer.Last().State == OfferState.ConfirmedByCreator;

    public bool isCanceld => _statesOffer.Last().State == OfferState.CanceledByCreator;

    private Offer() { }

    public Offer(int id, int orderId, string userName, decimal itemsTotalCost,
                 decimal deliveryCost, decimal? expenses = 0m, string? comment = null) :
        this(orderId, userName, itemsTotalCost, deliveryCost, expenses, comment)
    {
        Id = id;
    }

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


    public override bool Equals(object? obj)
    {
        if (obj == null || !(obj is Offer))
            return false;

        if (this.GetType() != obj.GetType())
            return false;

        Offer offer = (Offer)obj;

        if (offer.ItemsTotalCost == this.ItemsTotalCost &&
            offer.DeliveryCost == this.DeliveryCost &&
            offer.UserName == this.UserName &&
            offer.OrderId == this.OrderId &&
            offer.Comment == this.Comment &&
            offer.Expenses == this.Expenses &&
            offer.Deleted == this.Deleted &&
            offer.isSelected == this.isSelected)
            return true;
        else
            return false;
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

    /// <summary>
    /// Remove offer (set date delete)
    /// </summary>
    /// <exception cref="DeleteOfferException"></exception>
    public void Remove()
    {
        if (isDeletable) Deleted = DateTime.Now;
        else throw new DeleteOfferException(Id);
    }

    /// <summary>
    /// Updates offer by params
    /// </summary>
    /// <param name="itemsTotalCost"></param>
    /// <param name="deliveryCost"></param>
    /// <param name="expenses"></param>
    /// <param name="comment"></param>
    /// <exception cref="UpdateOfferException"></exception>
    public void Update(decimal itemsTotalCost, decimal deliveryCost,
                       decimal? expenses, string? comment)
    {
        if (isEditable)
        {
            ItemsTotalCost = itemsTotalCost;
            DeliveryCost = deliveryCost;
            Expenses = expenses;
            Comment = comment;
        }
        else throw new UpdateOfferException(Id);
    }
}
