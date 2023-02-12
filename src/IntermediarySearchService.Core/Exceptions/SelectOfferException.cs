namespace IntermediarySearchService.Core.Exceptions;

public class SelectOfferException : EntityStateChangeException
{
    public SelectOfferException(int offerId) : base($"Offer with id:{offerId} can't be selected")
    { }
}