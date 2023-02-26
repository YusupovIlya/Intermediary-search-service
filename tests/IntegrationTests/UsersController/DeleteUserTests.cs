using System.Net;

namespace IntegrationTests.UsersController;

public class DeleteUserTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    public DeleteUserTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task DeleteUserWithNoContentCode()
    {
        var response = await _client.DeleteAsync("/api/v1/users/e2d76f00-c390-45df-bbb5-6deec979e949");
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task ReturnsNotFound()
    {
        var response = await _client.DeleteAsync("/api/v1/users/e2d76f00-c390-45df-bbb5-6deec000e949");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
