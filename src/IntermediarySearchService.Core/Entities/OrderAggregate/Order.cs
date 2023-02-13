using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Interfaces;
using IntermediarySearchService.Core.Exceptions;
using System.Linq;

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
    public bool HasConfirmedOffer => GetActiveOffer() == null ? false : GetActiveOffer()
                                                                             .StatesOffer
                                                                             .Select(of => of.State)
                                                                             .Contains(OfferState.ConfirmedByCreator);
    public bool CanBeClosed => _statesOrder.Last().State == OrderState.Shipped;

    private Order() { }

    public Order(string userName, string siteName, string siteLink, decimal performerFee, 
                 List<OrderItem> orderItems, Address address, bool isBuyingByMyself)
    {
        UserName = userName;
        SiteName = siteName;
        SiteLink = siteLink;
        PerformerFee = performerFee;
        Address = address;
        _orderItems = orderItems;
        this.isBuyingByMyself = isBuyingByMyself;
        AddStateOrder();
    }

    /// <summary>
    /// Updates order by params
    /// </summary>
    /// <exception cref="UpdateOrderException"></exception>
    public void Update(string siteName, string siteLink, decimal performerFee, List<OrderItem> orderItems)
    {
        if (isEditable)
        {
            SiteName = siteName;
            SiteLink = siteLink;
            PerformerFee = performerFee;
            _orderItems.Clear();
            _orderItems.AddRange(orderItems);
        }
        else throw new UpdateOrderException(Id);
    }

    /// <summary>
    /// Closes order
    /// </summary>
    /// <exception cref="CloseOrderException"></exception>
    public void CloseOrder()
    {
        if (_statesOrder.Last().State == OrderState.Shipped)
        {
            GetActiveOffer().AddStateOffer(OfferState.Completed);
            AddStateOrder(OrderState.Received);
        }
        else throw new CloseOrderException(Id);
    }

    /// <summary>
    /// Sets track code to order
    /// </summary>
    /// <param name="trackCode"></param>
    /// <exception cref="SetTrackCodeException"></exception>
    public void SetTrackCode(string trackCode) {
        if (GetActiveOffer().isNeedTrackNumber)
        {
            TrackCode = trackCode;
            AddStateOrder(OrderState.Shipped);
            GetActiveOffer().AddStateOffer(OfferState.Shipped);
        }
        else throw new SetTrackCodeException(Id);
    }

    /// <summary>
    /// Confirms offer by id
    /// </summary>
    /// <param name="offerId"></param>
    /// <exception cref="ConfirmOfferException"></exception>
    /// <exception cref="OfferNotFoundException"></exception>
    public void ConfirmOffer(int offerId)
    {
        if (HasConfirmedOffer) throw new ConfirmOfferException(offerId);
        else
        {
            var offer = _offers.FirstOrDefault(o => o.Id == offerId);
            if (offer != null)
            {
                foreach (var item in _offers)
                {
                    if (item.Id != offerId)
                        item.AddStateOffer(OfferState.Canceled);
                    else
                        item.AddStateOffer(OfferState.ConfirmedByCreator);
                }
                AddStateOrder(OrderState.AwaitingShipment);
            }
            else
                throw new OfferNotFoundException(offerId);
        }
    }

    /// <summary>
    /// Selects offer as active by id
    /// </summary>
    /// <param name="offerId"></param>
    /// <exception cref="SelectOfferException"></exception>
    /// <exception cref="OfferNotFoundException"></exception>
    public void SelectOffer(int offerId)
    {
        if (HasConfirmedOffer) throw new SelectOfferException(offerId);
        else
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

    public Offer? GetActiveOffer() => _offers.FirstOrDefault(of => of.isSelected);

}
