using System.Net;

namespace IntegrationTests.UsersController;

public class GetAddressesTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    public GetAddressesTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetUserProfileWithOkCode()
    {
        var response = await _client.GetAsync("/api/v1/users/2d3cc540-1459-4cb4-8603-5d83a3e8fc36/addresses");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task ReturnsNoContent()
    {
        var response = await _client.GetAsync("/api/v1/users/2d3cc540-1459-4cb4-8603-5d83a3r4fc36/addresses");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
