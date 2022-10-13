namespace IntermediarySearchService.Core.Exceptions;

public class OfferNotFoundException : Exception
{
    public OfferNotFoundException(int offerId) : base($"Offer doesn't found with id = {offerId}")
    { }
}

