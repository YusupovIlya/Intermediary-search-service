using AutoMapper;
using IntermediarySearchService.Api.DtoModels;
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
    public OfferController(IOfferService offerService, IMapper mapper)
    {
        _offerService = offerService;
        _mapper = mapper;
    }


    [Route("create")]
    [HttpPost]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> CreateOffer([FromBody] NewOfferModel offer)
    {
        var offerId = await _offerService.CreateAsync(offer.OrderId, UserName, offer.ItemsTotalCost,
                                                      offer.DeliveryCost, offer.Expenses);
        var response = new ResponseModel(offerId.ToString(), ResponseModel.Success);
        return Ok(response);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _offerService.DeleteAsync(id);
        return Ok();
    }
}
