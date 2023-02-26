
using System.Net;
using System.Text;
using IntermediarySearchService.Api.DtoModels;
using IntermediarySearchService.Core.Constants;
using Newtonsoft.Json;

namespace IntegrationTests.AuthController;

public class LoginTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    public LoginTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task LoginWithOkCode()
    {
        var content = new LoginRequestModel() { Email = AuthConstants.EMAIL, Password = AuthConstants.DEFAULT_PASSWORD };
        var stringContent = new StringContent(JsonConvert.SerializeObject(content), Encoding.UTF8, "application/json");
        var response = await _client.PostAsync("/api/v1/auth/login", stringContent);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task ReturnsModelInvalid()
    {
        var content = new LoginRequestModel() { Password = AuthConstants.DEFAULT_PASSWORD };
        var stringContent = new StringContent(JsonConvert.SerializeObject(content), Encoding.UTF8, "application/json");
        var response = await _client.PostAsync("/api/v1/auth/login", stringContent);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
