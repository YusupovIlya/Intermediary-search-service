using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Interfaces;
using IntermediarySearchService.Core.Exceptions;

namespace IntermediarySearchService.Core.Services;

public class OfferService : IOfferService
{
    private readonly IRepository<Offer> _offerRepository;
    public OfferService(IRepository<Offer> offerRepository)
    {
        _offerRepository = offerRepository;
    }
    public async Task<int> CreateAsync(int orderId, string userName, decimal itemsTotalCost,
                            decimal deliveryCost, decimal? expenses = 0m, string? comment = null)
    {
        var offer = new Offer(orderId, userName, itemsTotalCost, deliveryCost, expenses, comment);
        await _offerRepository.AddAsync(offer);
        return offer.Id;
    }

    public async Task DeleteAsync(int offerId)
    {
        var offer = await _offerRepository.GetByIdAsync(offerId);
        if (offer != null)
            await _offerRepository.DeleteAsync(offer);
        else
            throw new OfferNotFoundException(offerId);
    }
}
