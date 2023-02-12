namespace IntermediarySearchService.Core.Exceptions;

public class UserNotFoundException: EntityNotFoundException
{
    public UserNotFoundException(string email) : base($"User doesn't found with this email = {email}")
    { }
}
