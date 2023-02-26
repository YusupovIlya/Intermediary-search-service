

using System.Net;

namespace IntegrationTests.OrdersController;

public class CloseTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    public CloseTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CloseOrderWithOkCode()
    {
        var response = await _client.PutAsync("/api/v1/orders/2/close", null);
        var responseString = await response.Content.ReadAsStringAsync();
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("\"id\":\"2\"", responseString);
    }

    [Fact]
    public async Task ReturnsConflict()
    {
        var response = await _client.PutAsync("/api/v1/orders/1/close", null);
        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task ReturnsNotFound()
    {
        var response = await _client.PutAsync("/api/v1/orders/100/close", null);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
