namespace IntermediarySearchService.Core.Exceptions;

public class OfferNotFoundException : EntityNotFoundException
{
    public OfferNotFoundException(int offerId) : base($"Offer doesn't found with id = {offerId}")
    { }
}

