

using System.Net;

namespace IntegrationTests.UsersController;

public class GetUserProfileTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    public GetUserProfileTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetUserProfileWithOkCode()
    {
        var response = await _client.GetAsync("/api/v1/users/user@email.com");
        var responseString = await response.Content.ReadAsStringAsync();
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("\"email\":\"user@email.com\"", responseString);
    }

    [Fact]
    public async Task ReturnsNotFound()
    {
        var response = await _client.GetAsync("/api/v1/users/user234342@email.com");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
