namespace IntermediarySearchService.Api.DtoModels;

public class OfferModel : NewOfferModel
{
    public int Id { get; set; }
    public bool isSelected { get; set; }
    public IEnumerable<StateModel> StatesOffer { get; set; }
}
