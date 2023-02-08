using AutoMapper;
using IntermediarySearchService.Api.DtoModels;
using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Exceptions;
using IntermediarySearchService.Core.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IntermediarySearchService.Api.Controllers;

[ApiController]
public class OfferController : BaseController
{
    private readonly IOfferService _offerService;
    private readonly IMapper _mapper;
    private readonly ILogger<OfferController> _logger;
    public OfferController(IOfferService offerService, IMapper mapper, ILogger<OfferController> logger)
    {
        _offerService = offerService;
        _mapper = mapper;
        _logger = logger;
    }

    /// <summary>
    /// Creates new offer
    /// </summary>
    /// <param name="offer">New offer params</param>
    /// <returns>Creating result message</returns>
    /// <response code="201">Returns success message</response>
    /// <response code="400">Model state invalid</response>
    /// <response code="401">Unauthorized</response>
    [Authorize]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(ResponseModel))]
    [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ValidationProblemDetails))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateOffer([FromBody] NewOfferModel offer)
    {
        var offerId = await _offerService.CreateAsync(offer.OrderId, UserName, offer.ItemsTotalCost,
                                                      offer.DeliveryCost, offer.Expenses, offer.Comment);
        var response = new ResponseModel(offerId.ToString(), ResponseModel.Success);
        return Created($"{Request.Path}/{offerId}", response);
    }

    /// <summary>
    /// Changes offer state
    /// </summary>
    /// <param name="id">offer id</param>
    /// <param name="orderId">order id</param>
    /// <param name="state">new offer state</param>
    /// <response code="200">State was changed</response>
    /// <response code="401">Unauthorized</response>
    /// <response code="403">Forbidden</response>
    /// <response code="404">Order or offer wasn't found with this id</response>
    [Authorize]
    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseModel))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseModel))]
    public async Task<IActionResult> ChangeState([FromRoute] int id, 
                                                 [FromQuery] int orderId, 
                                                 [FromQuery] OfferState state)
    {
        try
        {
            await _offerService.ChangeOfferStateAsync(id, orderId, state, UserName);
            var response = new ResponseModel(id.ToString(), ResponseModel.Success);
            return Ok(response);
        }
        catch (OfferNotFoundException ex)
        {
            _logger.LogInformation(ex.Message);
            var response = new ResponseModel(id.ToString(), ex.Message);
            return NotFound(response);
        }
        catch (OrderNotFoundException ex)
        {
            _logger.LogInformation(ex.Message);
            var response = new ResponseModel(orderId.ToString(), ex.Message);
            return NotFound(response);
        }
        catch (ForbiddenActionException ex)
        {
            _logger.LogInformation(ex.Message);
            return Forbid();
        }
    }




    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _offerService.DeleteAsync(id);
        return Ok();
    }
}
