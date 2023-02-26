using System.Net;

namespace IntegrationTests.OrdersController;

public class GetOrdersTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    public GetOrdersTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task ReturnsOrdersWithOkCode()
    {
        var response = await _client.GetAsync("/api/v1/orders?page=1&pageSize=5");
        var responseString = await response.Content.ReadAsStringAsync();
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("\"id\":1", responseString);
    }

    [Fact]
    public async Task ReturnsNoContent()
    {
        var response = await _client.GetAsync("/api/v1/orders?page=1&pageSize=5&shops=amazon&countries=USA");
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }
}
