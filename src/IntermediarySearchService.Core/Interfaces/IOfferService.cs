using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Exceptions;

namespace IntermediarySearchService.Core.Interfaces;

public interface IOfferService
{
    /// <summary>
    /// Creates new offer
    /// </summary>
    /// <param name="orderId">order id</param>
    /// <param name="userName">creator's username</param>
    /// <param name="itemsTotalCost">cost of items</param>
    /// <param name="deliveryCost">cost of delivery</param>
    /// <param name="expenses">additional expenses</param>
    /// <param name="comment">some comment</param>
    /// <returns>Created offer id</returns>
    /// <exception cref="OfferCreatingException"></exception>
    /// <exception cref="OrderNotFoundException"></exception>
    Task<int> CreateAsync(int orderId, string userName, decimal itemsTotalCost,
                          decimal deliveryCost, decimal? expenses = 0m, string? comment = null);

    /// <summary>
    /// Get offer by id
    /// </summary>
    /// <param name="id">offer id</param>
    /// <exception cref="OfferNotFoundException"></exception>
    /// <returns>Offer by its id</returns>
    Task<Offer> GetByIdAsync(int id);

    /// <summary>
    /// Get user offers by offer states
    /// </summary>
    /// <param name="userName">username</param>
    /// <param name="offerStates">array of offer states</param>
    /// <param name="sortBy">sorting type</param>
    /// <returns>User offers by states</returns>
    Task<IEnumerable<Offer>> GetUserOffersAsync(string userName, OfferState[] offerStates, string? sortBy);

    /// <summary>
    /// Deletes offer by id
    /// </summary>
    /// <param name="id">offer id</param>
    /// <exception cref="OfferNotFoundException"></exception>
    /// <exception cref="DeleteOfferException"></exception>
    Task DeleteAsync(int id);

    /// <summary>
    /// Changes current offer state
    /// </summary>
    /// <param name="id">offer id</param>
    /// <param name="offerState">new offer state</param>
    /// <exception cref="OfferNotFoundException"></exception>
    /// <exception cref="ConfirmOfferException"></exception>
    Task ChangeOfferStateAsync(int id, OfferState offerState);

    /// <summary>
    /// Updates offer
    /// </summary>
    /// <exception cref="OfferNotFoundException"></exception>
    /// <exception cref="UpdateOfferException"></exception>
    Task UpdateAsync(int id, decimal itemsTotalCost, decimal deliveryCost, 
                     decimal? expenses, string? comment);
}
