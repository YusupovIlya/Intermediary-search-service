namespace IntermediarySearchService.Core.Exceptions;

public class OfferCreatingException : EntityStateChangeException
{
    public OfferCreatingException(int orderId) : base($"Attempt to send offer to the own order #{orderId}")
    { }
}
