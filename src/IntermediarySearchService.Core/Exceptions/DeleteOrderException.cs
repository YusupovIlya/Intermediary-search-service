namespace IntermediarySearchService.Core.Exceptions;

public class DeleteOrderException : EntityStateChangeException
{
    public DeleteOrderException(int orderId) : base($"Order with id:{orderId} isn't delitable by its state")
    { }
}
