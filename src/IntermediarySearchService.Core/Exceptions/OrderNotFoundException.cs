namespace IntermediarySearchService.Core.Exceptions;

public class OrderNotFoundException : Exception
{
    public OrderNotFoundException(int orderId) : base($"Order doesn't found with id = {orderId}")
    { }
}
