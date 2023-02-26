using System.Net;

namespace IntegrationTests.OffersController;

public class DeleteTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    public DeleteTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task DeleteOfferWithNoContentCode()
    {
        var response = await _client.DeleteAsync("/api/v1/offers/1");
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task ReturnsNotFound()
    {
        var response = await _client.DeleteAsync("/api/v1/offers/100");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
