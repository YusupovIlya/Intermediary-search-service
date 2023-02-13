using IntermediarySearchService.Api.DtoModels;
using IntermediarySearchService.Api.Services;
using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntermediarySearchService.Api.Controllers;

[TypeFilter(typeof(EntityNotFoundExceptionFilter))]
[TypeFilter(typeof(EntityStateChangeExceptionFilter))]
public class OffersController : BaseController
{
    private readonly IOfferService _offerService;
    public OffersController(IOfferService offerService)
    {
        _offerService = offerService;
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
    [ProducesResponseType(StatusCodes.Status401Unauthorized, Type = typeof(EmptyResult))]
    public async Task<IActionResult> Create([FromBody] NewOfferModel offer)
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
    /// <param name="state">new offer state</param>
    /// <response code="200">State was changed</response>
    /// <response code="401">Unauthorized</response>
    /// <response code="403">Forbidden</response>
    /// <response code="404">Offer wasn't found with this id</response>
    /// <response code="409">Failed to change offer status</response>
    [Authorize(Policy = "OwnerEntity")]
    [HttpPut("{id:int}/states/{state}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseModel))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized, Type = typeof(EmptyResult))]
    [ProducesResponseType(StatusCodes.Status403Forbidden, Type = typeof(ResponseModel))]
    [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseModel))]
    [ProducesResponseType(StatusCodes.Status409Conflict, Type = typeof(ResponseModel))]
    public async Task<IActionResult> ChangeState([FromRoute] int id, 
                                                 [FromRoute] OfferState state)
    {
        await _offerService.ChangeOfferStateAsync(id, state);
        var response = new ResponseModel(id.ToString(), ResponseModel.Success);
        return Ok(response);
    }

    /// <summary>
    /// Update offer
    /// </summary>
    /// <remarks>PUT api/v1/offers/5</remarks>
    /// <param name="id">offer id</param>
    /// <param name="model">updated offer model</param>
    /// <response code="200">Offer was updated</response>
    /// <response code="401">Unauthorized</response>
    /// <response code="403">Forbidden</response>
    /// <response code="404">Offer wasn't found with this id</response>
    /// <response code="409">Failed to update offer</response>
    [Authorize(Policy = "OwnerEntity")]
    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(EmptyResult))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized, Type = typeof(EmptyResult))]
    [ProducesResponseType(StatusCodes.Status403Forbidden, Type = typeof(ResponseModel))]
    [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseModel))]
    [ProducesResponseType(StatusCodes.Status409Conflict, Type = typeof(ResponseModel))]
    public async Task<IActionResult> Update([FromRoute] int id,
                                            [FromBody] EditedOfferModel model)
    {
        await _offerService.UpdateAsync(id, model.ItemsTotalCost, model.DeliveryCost,
                                        model.Expenses, model.Comment);
        var response = new ResponseModel(id.ToString(), $"Offer with id - {id} was updated");
        return Ok(response);
    }


    /// <summary>
    /// Deletes offer by id
    /// </summary>
    /// <remarks>DELETE api/v1/offers/5</remarks>
    /// <param name="id">order id</param>
    /// <response code="204">Offer was deleted</response>
    /// <response code="401">Unauthorized</response>
    /// <response code="403">Forbidden</response>
    /// <response code="404">Offer wasn't found with this id</response>
    /// <response code="409">Failed to delete offer</response>
    [Authorize(Policy = "OwnerEntity")]
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent, Type = typeof(EmptyResult))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized, Type = typeof(EmptyResult))]
    [ProducesResponseType(StatusCodes.Status403Forbidden, Type = typeof(ResponseModel))]
    [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseModel))]
    [ProducesResponseType(StatusCodes.Status409Conflict, Type = typeof(ResponseModel))]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        await _offerService.DeleteAsync(id);
        return NoContent();
    }
}
