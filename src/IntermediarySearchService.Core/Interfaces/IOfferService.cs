using IntermediarySearchService.Core.Entities.OfferAggregate;
using System.Threading.Tasks;

namespace IntermediarySearchService.Core.Interfaces;

public interface IOfferService
{
    Task<int> CreateAsync(int orderId, string userName, decimal itemsTotalCost,
                     decimal deliveryCost, decimal? expenses = 0m, string? comment = null);

    Task<IEnumerable<Offer>> GetUserOffersAsync(string userName, OfferState[] offerStates, string? sortBy);

    Task DeleteAsync(int offerId);

    Task ChangeOfferStateAsync(int offerId, int orderId, OfferState offerState, string initatorUserName);
}
