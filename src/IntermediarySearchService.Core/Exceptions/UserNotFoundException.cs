namespace IntermediarySearchService.Core.Exceptions;

public class UserNotFoundException: Exception
{
    public UserNotFoundException(string email) : base($"User doesn't found with this email = {email}")
    { }
}
