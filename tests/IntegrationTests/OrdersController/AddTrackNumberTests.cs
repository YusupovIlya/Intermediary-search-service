using System.Net;


namespace IntegrationTests.OrdersController;

public class AddTrackNumberTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    public AddTrackNumberTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task AddTrackWithOkCode()
    {
        var response = await _client.PutAsync("/api/v1/orders/2/tracknumber/HJSJ12707H", null);
        var responseString = await response.Content.ReadAsStringAsync();
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("\"id\":\"2\"", responseString);
    }

    [Fact]
    public async Task ReturnsConflict()
    {
        var response = await _client.PutAsync("/api/v1/orders/1/tracknumber/HJSJ12707H", null);
        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task ReturnsNotFound()
    {
        var response = await _client.PutAsync("/api/v1/orders/221/tracknumber/HJSJ12707H", null);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
