using IntermediarySearchService.Api.DtoModels;
using Microsoft.AspNetCore.Mvc.Filters;

namespace IntermediarySearchService.Api.Services;

public class EntityNotFoundExceptionFilter : IAsyncExceptionFilter
{
    private readonly ILogger<EntityNotFoundExceptionFilter> _logger;
    public EntityNotFoundExceptionFilter(ILogger<EntityNotFoundExceptionFilter> logger)
    {
        _logger = logger;
    }

    public async Task OnExceptionAsync(ExceptionContext context)
    {
        _logger.LogError(context.Exception.Message);
        var idFromRoute = context.HttpContext.Request.RouteValues["id"].ToString();
        context.HttpContext.Response.StatusCode = StatusCodes.Status404NotFound;
        var errorResponse = new ResponseModel(idFromRoute, context.Exception.Message);
        await context.HttpContext.Response.WriteAsJsonAsync(errorResponse);
    }
}
