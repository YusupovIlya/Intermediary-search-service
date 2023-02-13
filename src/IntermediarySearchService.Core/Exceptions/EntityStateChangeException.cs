namespace IntermediarySearchService.Core.Exceptions;

public class EntityStateChangeException : Exception
{
    public EntityStateChangeException(string message) : base(message)
    { }
}