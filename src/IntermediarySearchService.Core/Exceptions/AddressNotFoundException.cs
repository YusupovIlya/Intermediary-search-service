namespace IntermediarySearchService.Core.Exceptions;

public class AddressNotFoundException : EntityNotFoundException
{
    public AddressNotFoundException(int id, string userName) : base($"{userName}: address with id - {id} not found!")
    { }
}
