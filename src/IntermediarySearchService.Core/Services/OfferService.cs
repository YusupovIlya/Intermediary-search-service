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
    public async Task CreateAsync(int orderId, string userId, decimal itemsTotalCost,
                            decimal deliveryCost, decimal? expenses = 0m)
    {
        var offer = new Offer(orderId, userId, itemsTotalCost, deliveryCost, expenses);
        await _offerRepository.AddAsync(offer);
    }

    public async Task DeleteAsync(int offerId)
    {
        var order = await _offerRepository.GetByIdAsync(offerId);
        if (order != null)
        {
            await _offerRepository.DeleteAsync(order);
        }
        else
            throw new OfferNotFoundException(offerId);
    }
}
