namespace IntermediarySearchService.Core.Exceptions;

public class UserCreatingException : Exception
{
    public UserCreatingException(string userName, string message) : base($"An error occurred while creating the user - {userName}\nMessage: {message}")
    { }
}

