namespace IntermediarySearchService.Core.Exceptions;

public class UpdateOrderException : EntityStateChangeException
{
    public UpdateOrderException(int orderId) : base($"Order with id:{orderId} isn't editable by its state")
    { }
}