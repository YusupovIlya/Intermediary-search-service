using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Core.Interfaces;
using UnitTests.Builders;

namespace IntegrationTests;

public class DbTestContextSeed
{
    public static async Task SeedAsync(IRepository<Order> repo)
    {
        var orderBuilder = new OrderBuilder();
        var offerBuilder = new OfferBuilder();

        var offer = offerBuilder
                    .WithDefaultValues()
                    .Build();

        var order = orderBuilder
                            .WithOffers(offer)
                            .Build();

        orderBuilder.id = 2;
        offerBuilder.id = 2;
        offerBuilder.orderId = 2;

        var offer_1 = offerBuilder
                            .WithDefaultValues()
                            .WithSelectStatus(true)
                            .WithState(OfferState.ConfirmedByCreator)
                            .Build();

        var order_1 = orderBuilder
                        .WithDefaultValues()
                        .WithOffers(offer_1)
                        .WithState(OrderState.Shipped)
                        .Build();

        orderBuilder.id = 3;
        var order_2 = orderBuilder
                          .WithDefaultValues()
                          .Build();

        await repo.AddAsync(order);
        await repo.AddAsync(order_1);
        await repo.AddAsync(order_2);
    }
}
