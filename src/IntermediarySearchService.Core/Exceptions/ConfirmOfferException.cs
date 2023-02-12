namespace IntermediarySearchService.Core.Exceptions;

public class ConfirmOfferException : EntityStateChangeException
{
    public ConfirmOfferException(int offerId) : base($"Offer with id:{offerId} can't be confirmed")
    { }
}