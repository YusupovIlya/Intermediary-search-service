using IntermediarySearchService.Core.Constants;
using IntermediarySearchService.Core.Interfaces;

namespace IntermediarySearchService.Api.Services;

public class AuthenticatedTestRequestMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ITokenService _tokenClaimsService;

    public AuthenticatedTestRequestMiddleware(RequestDelegate next,
                                              ITokenService tokenClaimsService)
    {
        _next = next;
        _tokenClaimsService = tokenClaimsService;
    }

    public async Task Invoke(HttpContext context)
    {
        var token = await _tokenClaimsService.GetTokenAsync(AuthConstants.EMAIL);
        context.Request.Headers.Authorization = $"Bearer {token}";
        await _next(context);
    }
}
