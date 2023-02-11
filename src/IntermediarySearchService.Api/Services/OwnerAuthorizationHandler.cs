using IntermediarySearchService.Api.DtoModels;
using IntermediarySearchService.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace IntermediarySearchService.Api.Services;

public class OwnerAuthorizationHandler : AuthorizationHandler<SameOwnerRequirement>
{
    private readonly IOrderService _orderService;
    private readonly IOfferService _offerService;
    public OwnerAuthorizationHandler(IOrderService orderService, IOfferService offerService)
    {
        _orderService = orderService;
        _offerService = offerService;
    }
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context,
                                                         SameOwnerRequirement requirement)
    {
        if(context.Resource is HttpContext)
        {
            bool isOwner = false;
            var httpContext = (HttpContext)context.Resource;
            var idFromRoute = httpContext.Request.RouteValues["id"].ToString();
            var id = int.Parse(idFromRoute);
            var controllerName = httpContext.Request.RouteValues["controller"].ToString();
            switch (controllerName)
            {
                case "Orders":
                    var order = await _orderService.GetByIdAsync(id);
                    isOwner = context.User.Identity?.Name == order.UserName;
                    break;
                case "Offers":
                    var offer = await _offerService.GetByIdAsync(id);
                    isOwner = context.User.Identity?.Name == offer.UserName;
                    break;
            }
            if (isOwner)
            {
                context.Succeed(requirement);
            }
            else
            {
                httpContext.Response.StatusCode = StatusCodes.Status403Forbidden;
                var errorResponse = new ResponseModel(idFromRoute, $"{context.User.Identity.Name} has not access to this entity!");
                await httpContext.Response.WriteAsJsonAsync(errorResponse);
            }
        }
    }
}

public class SameOwnerRequirement : IAuthorizationRequirement { }