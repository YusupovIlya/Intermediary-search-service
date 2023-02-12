namespace IntermediarySearchService.Core.Exceptions;

public class OrderNotFoundException : EntityNotFoundException
{
    public OrderNotFoundException(int orderId) : base($"Order doesn't found with id = {orderId}")
    { }
}
