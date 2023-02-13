namespace IntermediarySearchService.Core.Exceptions;

public class UserNotFoundException: EntityNotFoundException
{
    public UserNotFoundException(string id) : base($"User doesn't found with this id = {id}")
    { }
}
