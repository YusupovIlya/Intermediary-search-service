using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Interfaces;
using IntermediarySearchService.Core.Exceptions;

namespace IntermediarySearchService.Core.Entities.OrderAggregate;

public enum StateOrder
{
    InSearchPerformer,
    AwaitingShipment,
    Shipped,
    Received,
}


public class Order: BaseEntity, IAggregateRoot
{
    public string UserName { get; private set; }
    public string SiteName { get; private set; }
    public string SiteLink { get; private set; }
    public decimal PerformerFee { get; private set; }
    public StateOrder StateOrder { get; private set; } = StateOrder.InSearchPerformer;

    private readonly List<OrderItem> _orderItems = new List<OrderItem>();
    public IReadOnlyCollection<OrderItem> OrderItems => _orderItems.AsReadOnly();

    private readonly List<Offer> _offers = new List<Offer>();
    public IReadOnlyCollection<Offer> Offers => _offers.AsReadOnly();

    public Order(string userName, string siteName, string siteLink, 
        decimal performerFee, List<OrderItem> orderItems)
    {
        UserName = userName;
        SiteName = siteName;
        SiteLink = siteLink;
        PerformerFee = performerFee;
        _orderItems = orderItems;
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

    public decimal TotalOrderPrice() => _orderItems.Sum(i => i.Units * i.UnitPrice);

}
