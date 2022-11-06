using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Interfaces;
using IntermediarySearchService.Core.Exceptions;
using System.ComponentModel;

namespace IntermediarySearchService.Core.Entities.OrderAggregate;

public class Order: BaseEntity, IAggregateRoot
{
    public string UserName { get; private set; }
    public string SiteName { get; private set; }
    public string SiteLink { get; private set; }
    public decimal PerformerFee { get; private set; }

    private readonly List<StateOrder> _statesOrder = new List<StateOrder>();
    public IReadOnlyCollection<StateOrder> StatesOrder => _statesOrder.AsReadOnly();

    private readonly List<OrderItem> _orderItems = new List<OrderItem>();
    public IReadOnlyCollection<OrderItem> OrderItems => _orderItems.AsReadOnly();

    private readonly List<Offer> _offers = new List<Offer>();
    public IReadOnlyCollection<Offer> Offers => _offers.AsReadOnly();

    private Order() { }

    public Order(List<OrderItem> orderItems)
    {
        _orderItems = orderItems;
    }

    public Order(string userName, string siteName, string siteLink, 
        decimal performerFee, List<OrderItem> orderItems) : this(orderItems)
    {
        UserName = userName;
        SiteName = siteName;
        SiteLink = siteLink;
        PerformerFee = performerFee;
        AddStateOrder();
    }

    public void AddItem(string productName, string options, string productLink,
                        decimal unitPrice, int units = 1)
    {
        var orderItem = new OrderItem(productName, options, productLink, unitPrice, units);
        _orderItems.Add(orderItem);
    }

    public void AddItem(OrderItem item)
    {
        _orderItems.Add(item);
    }

    public void DeleteItem(int itemId)
    {
        var orderItem = _orderItems.FirstOrDefault(o => o.Id == itemId);
        if (orderItem != null)
        {
            _orderItems.Remove(orderItem);
        }
        else
            throw new OrderItemNotFoundException(itemId);
    }

    public void ChangeStatusOffer(int offerId, bool selectStatus)
    {
        var offer = _offers.FirstOrDefault(o => o.Id == offerId);
        if (offer != null)
        {
            offer.ChangeSelectStatus(selectStatus);
        }
        else
            throw new OfferNotFoundException(offerId);
    }

    public void AddStateOrder(State stateOrder = State.InSearchPerformer, string description = null)
    {
        StateOrder newState = new(stateOrder, description, DateTime.Now);
        _statesOrder.Add(newState);
    }

    public decimal TotalOrderPrice() => _orderItems.Sum(i => i.Units * i.UnitPrice);

}
