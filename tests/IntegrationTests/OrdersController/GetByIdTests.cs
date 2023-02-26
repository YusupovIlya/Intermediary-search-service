using System.Net;

namespace IntegrationTests.OrdersController;

public class GetByIdTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    public GetByIdTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task ReturnsOrderWithOkCode()
    {
        var response = await _client.GetAsync("/api/v1/orders/1");
        var responseString = await response.Content.ReadAsStringAsync();
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("\"id\":1", responseString);
    }

    [Fact]
    public async Task ReturnsNotFound()
    {
        var response = await _client.GetAsync("/api/v1/orders/1000");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
