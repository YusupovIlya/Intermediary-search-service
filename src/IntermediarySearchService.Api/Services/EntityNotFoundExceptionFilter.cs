using IntermediarySearchService.Api.DtoModels;
using IntermediarySearchService.Core.Exceptions;
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
        if(context.Exception is EntityNotFoundException)
        {
            _logger.LogError(context.Exception.Message);
            context.HttpContext.Response.StatusCode = StatusCodes.Status404NotFound;
            context.HttpContext.Response.ContentType = "application/problem+json";
            await context.HttpContext.Response.WriteAsync(context.Exception.Message);
        }
    }
}
