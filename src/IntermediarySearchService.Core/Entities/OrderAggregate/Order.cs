using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Interfaces;

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
    public string UserId { get; private set; }
    public string SiteName { get; private set; }
    public string SiteLink { get; private set; }
    public decimal PerformerFee { get; private set; }
    public StateOrder StateOrder { get; private set; }

    private readonly List<OrderItem> _orderItems = new List<OrderItem>();
    public IReadOnlyCollection<OrderItem> OrderItems => _orderItems.AsReadOnly();

    private readonly List<Offer> _offers = new List<Offer>();
    public IReadOnlyCollection<Offer> Offers => _offers.AsReadOnly();


    public void AddItem(string productName, string options, string productLink,
                        decimal unitPrice, int units = 1)
    {
        var orderItem = new OrderItem(productName, options, productLink, unitPrice, units);
        _orderItems.Add(orderItem);
    }

    public void DeleteItem(int itemId)
    {
        var orderItem = _orderItems.FirstOrDefault(o => o.Id == itemId);
        if (orderItem != null)
        {
            _orderItems.Remove(orderItem);
        }
        else
            throw new ArgumentNullException("Item with this id doesn't found");
    }

    public void ChangeStatusOffer(int offerId, bool selectStatus)
    {
        var offer = _offers.FirstOrDefault(o => o.Id == offerId);
        if(offer != null)
        {
            offer.ChangeSelectStatus(selectStatus);
        }
        else
            throw new ArgumentNullException("Offer with this id doesn't found");
    }

    public decimal TotalOrderPrice()
    {
        decimal result = 0m;
        foreach (var item in _orderItems)
        {
            result += item.Units * item.UnitPrice;
        }
        return result;
    }
}
