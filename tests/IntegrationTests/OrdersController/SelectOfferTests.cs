
using System.Net;

namespace IntegrationTests.OrdersController;

public class SelectOfferTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    public SelectOfferTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task SelectOfferWithOkCode()
    {
        var response = await _client.PutAsync("/api/v1/orders/1/offers/1", null);
        var responseString = await response.Content.ReadAsStringAsync();
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("\"id\":\"1\"", responseString);
    }

    [Fact]
    public async Task ReturnsNotFound()
    {
        var response = await _client.PutAsync("/api/v1/orders/123/offers/1", null);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
