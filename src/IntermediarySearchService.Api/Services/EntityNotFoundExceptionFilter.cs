﻿using IntermediarySearchService.Api.DtoModels;
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
            string idFromRoute = "0";
            try
            {
                idFromRoute = context.HttpContext.Request.RouteValues["id"].ToString();
            }
            catch (NullReferenceException) { }
            idFromRoute = context.HttpContext.Request.RouteValues["id"].ToString();
            context.HttpContext.Response.StatusCode = StatusCodes.Status404NotFound;
            var errorResponse = new ResponseModel(idFromRoute, context.Exception.Message);
            await context.HttpContext.Response.WriteAsJsonAsync(errorResponse);
        }
    }
}
