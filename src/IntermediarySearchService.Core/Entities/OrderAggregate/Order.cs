using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Interfaces;
using IntermediarySearchService.Core.Exceptions;

namespace IntermediarySearchService.Core.Entities.OrderAggregate;

public class Order: BaseEntity, IAggregateRoot
{
    public string UserName { get; private set; }
    public string SiteName { get; private set; }
    public string SiteLink { get; private set; }
    public decimal PerformerFee { get; private set; }
    public Address Address { get; private set; }
    public string? TrackCode { get; private set; } = null;
    public bool isBuyingByMyself { get; private set; }

    private readonly List<StateOrder> _statesOrder = new List<StateOrder>();
    public IReadOnlyCollection<StateOrder> StatesOrder => _statesOrder.AsReadOnly();

    private readonly List<OrderItem> _orderItems = new List<OrderItem>();
    public IReadOnlyCollection<OrderItem> OrderItems => _orderItems.AsReadOnly();

    private readonly List<Offer> _offers = new List<Offer>();
    public IReadOnlyCollection<Offer> Offers => _offers.AsReadOnly();

    public bool isEditable => _statesOrder.Last().State == OrderState.InSearchPerformer;
    public bool isDeletable => _statesOrder.Last().State == OrderState.Received || _statesOrder.Last().State == OrderState.InSearchPerformer;

    private Order() { }

    public Order(List<OrderItem> orderItems)
    {
        _orderItems = orderItems;
    }

    public Order(string userName, string siteName, string siteLink, decimal performerFee, 
                 List<OrderItem> orderItems, Address address, bool isBuyingByMyself) : this(orderItems)
    {
        UserName = userName;
        SiteName = siteName;
        SiteLink = siteLink;
        PerformerFee = performerFee;
        Address = address;
        this.isBuyingByMyself = isBuyingByMyself;
        AddStateOrder();
    }

    public void Update(string siteName, string siteLink, Address address,
                       decimal performerFee, List<OrderItem> orderItems)
    {
        SiteName = siteName;
        SiteLink = siteLink;
        PerformerFee = performerFee;
        Address = address;
        _orderItems.Clear();
        _orderItems.AddRange(orderItems);
    }

    public void CloseOrder()
    {
        var offer = GetActiveOffer();
        offer.AddStateOffer(OfferState.Completed);
        AddStateOrder(OrderState.Received);
    }

    public void SetTrackCode(string trackCode) {
        TrackCode = trackCode;
        AddStateOrder(OrderState.Shipped);
        GetActiveOffer().AddStateOffer(OfferState.Shipped);
    }

    public void ConfirmOffer(int offerId)
    {
        foreach(var offer in _offers)
        {
            if (offer.Id != offerId)
                offer.AddStateOffer(OfferState.Canceled);
            else
                offer.AddStateOffer(OfferState.ConfirmedByCreator);
        }
        AddStateOrder(OrderState.AwaitingShipment);
    }

    public void SelectOffer(int offerId)
    {
        var offer = _offers.FirstOrDefault(o => o.Id == offerId);
        if (offer != null)
        {
            _offers.ForEach(of => of.ChangeSelectStatus(false));
            offer.ChangeSelectStatus(true);
        }
        else
            throw new OfferNotFoundException(offerId);
    }

    public void CancelOffer(int offerId)
    {
        var offer = _offers.FirstOrDefault(o => o.Id == offerId);
        if (offer != null)
        {
            _offers.ForEach(of => of.ChangeSelectStatus(false));
            offer.AddStateOffer(OfferState.CanceledByCreator);
        }
        else
            throw new OfferNotFoundException(offerId);
    }

    public void AddStateOrder(OrderState stateOrder = OrderState.InSearchPerformer, string description = null)
    {
        StateOrder newState = new(stateOrder, description, DateTime.Now);
        _statesOrder.Add(newState);
    }

    public decimal TotalOrderPrice() => _orderItems.Sum(i => i.Units * i.UnitPrice);

    public Offer GetActiveOffer() => _offers.First(of => of.isSelected);

}
