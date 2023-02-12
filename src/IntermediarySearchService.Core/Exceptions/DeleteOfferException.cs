namespace IntermediarySearchService.Core.Exceptions;

public class DeleteOfferException : EntityStateChangeException
{
    public DeleteOfferException(int id) : base($"Offer with id:{id} isn't delitable by its state")
    { }
}
