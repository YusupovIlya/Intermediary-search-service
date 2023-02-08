using System.ComponentModel;

namespace IntermediarySearchService.Core.Entities.OrderAggregate;

public class StateOrder
{
    public OrderState State { get; private set; }
    public string? Description { get; private set; }
    public DateTime? Date { get; private set; }

    private StateOrder() { }

    public StateOrder(OrderState state, string description, DateTime date)
    {
        State = state;
        Description = description;
        Date = date;
    }

    public static string GetDescription(Enum value)
    {
        DescriptionAttribute attribute = value.GetType()
        .GetField(value.ToString())
        .GetCustomAttributes(typeof(DescriptionAttribute), false)
        .SingleOrDefault() as DescriptionAttribute;
        return attribute == null ? value.ToString() : attribute.Description;
    }
}

public enum OrderState
{
    [Description("In search performer")] InSearchPerformer,
    [Description("Awaiting shipment")] AwaitingShipment,
    [Description("Shipped")] Shipped,
    [Description("Received")] Received,
}