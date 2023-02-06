namespace IntermediarySearchService.Core.Exceptions;

public class ForbiddenActionException: Exception
{
    public ForbiddenActionException(string userName) : base($"User - {userName} initiated forbidden action")
    { }
}
