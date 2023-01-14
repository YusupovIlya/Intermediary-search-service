namespace IntermediarySearchService.Api.DtoModels
{
    public class NewOfferModel
    {
        public int OrderId { get; set; }
        public decimal ItemsTotalCost { get; set; }
        public decimal DeliveryCost { get; set; }
        public decimal? Expenses { get; set; }
        public string? Comment { get; set; }
    }
}
