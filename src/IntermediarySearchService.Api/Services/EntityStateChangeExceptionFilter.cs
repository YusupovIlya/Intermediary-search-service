using IntermediarySearchService.Api.DtoModels;
using IntermediarySearchService.Core.Exceptions;
using Microsoft.AspNetCore.Mvc.Filters;

namespace IntermediarySearchService.Api.Services;

public class EntityStateChangeExceptionFilter : IAsyncExceptionFilter
{
    private readonly ILogger<EntityStateChangeExceptionFilter> _logger;
    public EntityStateChangeExceptionFilter(ILogger<EntityStateChangeExceptionFilter> logger)
    {
        _logger = logger;
    }
    public async Task OnExceptionAsync(ExceptionContext context)
    {
        if(context.Exception is EntityStateChangeException)
        {
            _logger.LogError(context.Exception.Message);
            var idFromRoute = context.HttpContext.Request.RouteValues["id"].ToString();
            context.HttpContext.Response.StatusCode = StatusCodes.Status409Conflict;
            var errorResponse = new ResponseModel(idFromRoute, context.Exception.Message);
            await context.HttpContext.Response.WriteAsJsonAsync(errorResponse);
        }
    }
}
