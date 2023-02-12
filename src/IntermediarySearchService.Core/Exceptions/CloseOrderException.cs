namespace IntermediarySearchService.Core.Exceptions;

public class CloseOrderException : EntityStateChangeException
{
    public CloseOrderException(int orderId) : base($"Order with id:{orderId} can't be closed")
    { }
}