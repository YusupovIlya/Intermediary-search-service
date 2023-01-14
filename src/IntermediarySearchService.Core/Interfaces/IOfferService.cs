using System.Threading.Tasks;

namespace IntermediarySearchService.Core.Interfaces;

public interface IOfferService
{
    Task<int> CreateAsync(int orderId, string userName, decimal itemsTotalCost,
                     decimal deliveryCost, decimal? expenses = 0m, string? comment = null);
    Task DeleteAsync(int offerId);
}
