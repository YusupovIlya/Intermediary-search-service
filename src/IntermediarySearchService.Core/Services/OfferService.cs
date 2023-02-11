using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Interfaces;
using IntermediarySearchService.Core.Exceptions;
using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Specifications;

namespace IntermediarySearchService.Core.Services;

public class OfferService : IOfferService
{
    private readonly IRepository<Offer> _offerRepository;
    private readonly IRepository<Order> _orderRepository;
    private const string newest = "newest";
    private const string oldest = "oldest";
    public OfferService(IRepository<Offer> offerRepository, IRepository<Order> orderRepository)
    {
        _offerRepository = offerRepository;
        _orderRepository = orderRepository;
    }
    public async Task<int> CreateAsync(int orderId, string userName, decimal itemsTotalCost,
                            decimal deliveryCost, decimal? expenses = 0m, string? comment = null)
    {
        var offer = new Offer(orderId, userName, itemsTotalCost, deliveryCost, expenses, comment);
        await _offerRepository.AddAsync(offer);
        return offer.Id;
    }

    public async Task DeleteAsync(int id)
    {
        var offer = await _offerRepository.GetByIdAsync(id);
        if (offer != null)
            await _offerRepository.DeleteAsync(offer);
        else
            throw new OfferNotFoundException(id);
    }


    public async Task ChangeOfferStateAsync(int offerId, int orderId, OfferState offerState)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);

        switch (offerState)
        {
            case OfferState.ConfirmedByCreator:
                order.ConfirmOffer(offerId);
                break;
            case OfferState.CanceledByCreator:
                order.CancelOffer(offerId);
                break;
        }
        await _orderRepository.UpdateAsync(order);
    }

    public async Task<IEnumerable<Offer>> GetUserOffersAsync(string userName, OfferState[] offerStates, string? sortBy)
    {
        var offerSpec = new OffersSpecification(userName);
        var offers = await _offerRepository.ListAsync(offerSpec);

        if (offerStates.Length > 0) 
            offers = offers.Where(o => offerStates.Contains((OfferState)o.StatesOffer.Last()?.State)).ToList();

        return SortByParam(sortBy, offers);
    }

    private IEnumerable<Offer> SortByParam(string? param, IEnumerable<Offer> offers) =>
    param switch
    {
        newest => offers.OrderByDescending(o => o.StatesOffer.First().Date),
        oldest => offers.OrderBy(o => o.StatesOffer.First().Date),
        _ => offers,
    };

    public async Task<Offer> GetByIdAsync(int id)
    {
        var offerSpec = new OfferSpecification(id);
        var offer = await _offerRepository.FirstOrDefaultAsync(offerSpec);
        if (offer != null)
            return offer;
        else
            throw new OfferNotFoundException(id);
    }
}
