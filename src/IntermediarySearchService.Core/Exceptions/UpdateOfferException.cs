namespace IntermediarySearchService.Core.Exceptions;

public class UpdateOfferException : EntityStateChangeException
{
    public UpdateOfferException(int id) : base($"Offer with id:{id} isn't editable by its state")
    { }
}