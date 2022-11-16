using AutoMapper;
using IntermediarySearchService.Api.DtoModels;
using IntermediarySearchService.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IntermediarySearchService.Api.Controllers
{
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
        public async Task<IActionResult> CreateOffer([FromBody] NewOfferModel offer)
        {
            await _offerService.CreateAsync(offer.OrderId, GetUserName(), offer.ItemsTotalCost,
                                            offer.DeliveryCost, offer.Expenses);
            return Ok();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _offerService.DeleteAsync(id);
            return Ok();
        }
    }
}
