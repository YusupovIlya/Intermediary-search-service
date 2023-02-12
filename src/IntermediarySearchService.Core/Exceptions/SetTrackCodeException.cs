namespace IntermediarySearchService.Core.Exceptions;

public class SetTrackCodeException : EntityStateChangeException
{
    public SetTrackCodeException(int orderId) : base($"Order with id:{orderId} yet can't have a track number")
    { }
}