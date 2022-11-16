using System.Threading.Tasks;

namespace IntermediarySearchService.Core.Interfaces;

public interface IOfferService
{
    Task CreateAsync(int orderId, string userId, decimal itemsTotalCost,
                     decimal deliveryCost, decimal? expenses = 0m);
    Task DeleteAsync(int offerId);
}
