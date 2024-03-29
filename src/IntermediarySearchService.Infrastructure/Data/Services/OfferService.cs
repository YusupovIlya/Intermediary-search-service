﻿using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Exceptions;
using IntermediarySearchService.Core.Interfaces;

namespace IntermediarySearchService.Infrastructure.Data.Services;

public class OfferService : IOfferService
{
    private readonly IRepository<Offer> _offerRepository;
    private readonly IRepository<Order> _orderRepository;
    private readonly IOrderService _orderService;
    private const string maxMin = "maxmin";
    private const string minMax = "minmax";
    private const string newest = "newest";
    private const string oldest = "oldest";
    public OfferService(IRepository<Offer> offerRepository, 
                        IRepository<Order> orderRepository,
                        IOrderService orderService)
    {
        _offerRepository = offerRepository;
        _orderRepository = orderRepository;
        _orderService = orderService;
    }
    public async Task<int> CreateAsync(int orderId, string userName, decimal itemsTotalCost,
                            decimal deliveryCost, decimal? expenses = 0m, string? comment = null)
    {
        var order = await _orderService.GetByIdAsync(orderId);
        if (order.UserName != userName)
        {
            var offer = new Offer(orderId, userName, itemsTotalCost, deliveryCost, expenses, comment);
            await _offerRepository.AddAsync(offer);
            return offer.Id;
        }
        else
        {
            throw new OfferCreatingException(order.Id);
        }
    }

    public async Task DeleteAsync(int id)
    {
        var offer = await _offerRepository.SearchOneAsync(o => o.Id == id);
        if (offer != null)
        {
            offer.Remove();
            await _offerRepository.UpdateAsync(offer);
        }
        else
            throw new OfferNotFoundException(id);
    }


    public async Task ChangeOfferStateAsync(int id, OfferState offerState)
    {
        var offer = await GetByIdAsync(id);
        if (offer != null)
        {
            var order = await _orderService.GetByIdAsync(offer.OrderId);
            switch (offerState)
            {
                case OfferState.ConfirmedByCreator:
                    order.ConfirmOffer(id);
                    break;
                case OfferState.CanceledByCreator:
                    order.CancelOffer(id);
                    break;
            }
            await _orderRepository.UpdateAsync(order);
        }
        else
            throw new OfferNotFoundException(id);
    }

    public async Task<IEnumerable<Offer>> GetUserOffersAsync(string userName, OfferState[] offerStates, string? sortBy)
    {
        var offers = await _offerRepository.SearchManyAsync(of => of.UserName == userName && of.Deleted == null);

        if (offerStates.Length > 0)
            offers = offers.Where(o => offerStates.Contains((OfferState)o.StatesOffer.Last()?.State)).ToList();

        return SortByParam(sortBy, offers);
    }

    private IEnumerable<Offer> SortByParam(string? param, IEnumerable<Offer> offers) =>
    param switch
    {
        newest => offers.OrderByDescending(o => o.StatesOffer.First().Date),
        oldest => offers.OrderBy(o => o.StatesOffer.First().Date),
        minMax => offers.OrderBy(o => o.ItemsTotalCost),
        maxMin => offers.OrderByDescending(o => o.ItemsTotalCost),
        _ => offers,
    };

    public async Task<Offer> GetByIdAsync(int id)
    {
        var offer = await _offerRepository.SearchOneAsync(of => of.Id == id && of.Deleted == null);

        if (offer != null)
            return offer;
        else
            throw new OfferNotFoundException(id);
    }

    public async Task UpdateAsync(int id, decimal itemsTotalCost, decimal deliveryCost,
                                        decimal? expenses, string? comment)
    {
        var offer = await GetByIdAsync(id);
        if (offer != null)
        {
            offer.Update(itemsTotalCost, deliveryCost, expenses, comment);
            await _offerRepository.UpdateAsync(offer);
        }
        else
        {
            throw new OfferNotFoundException(id);
        }
    }
}
