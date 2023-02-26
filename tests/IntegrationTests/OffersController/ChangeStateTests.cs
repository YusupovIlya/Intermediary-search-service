using System.Net;

namespace IntegrationTests.OffersController;

public class ChangeStateTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    public ChangeStateTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task ChangeStatusOkCode()
    {
        var response = await _client.PutAsync("/api/v1/offers/1/states/4", null);
        var responseString = await response.Content.ReadAsStringAsync();
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("\"id\":\"1\"", responseString);
    }

    [Fact]
    public async Task ReturnsConflict()
    {
        var response = await _client.PutAsync("/api/v1/offers/2/states/4", null);
        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task ReturnsNotFound()
    {
        var response = await _client.PutAsync("/api/v1/offers/100/states/4", null);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
