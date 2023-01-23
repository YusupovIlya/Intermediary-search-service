using Microsoft.AspNetCore.Mvc;

namespace IntermediarySearchService.Api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class BaseController : ControllerBase
    {
        protected string UserName => HttpContext.User.Identity.Name;
    }
}
