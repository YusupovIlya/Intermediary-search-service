
using System.Net;

namespace IntegrationTests.OrdersController;

public class DeleteTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    public DeleteTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task DeleteOrderWithNoContentCode()
    {
        var response = await _client.DeleteAsync("/api/v1/orders/3");
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task ReturnsNotFound()
    {
        var response = await _client.DeleteAsync("/api/v1/orders/100");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
