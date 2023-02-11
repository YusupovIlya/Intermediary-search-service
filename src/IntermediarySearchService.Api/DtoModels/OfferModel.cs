namespace IntermediarySearchService.Api.DtoModels;

public class OfferModel : NewOfferModel
{
    public int Id { get; set; }
    public bool isSelected { get; set; }
    public string UserName { get; set; }
    public bool isEditable { get; set; }
    public bool isDeletable { get; set; }
    public bool isNeedConfirmation { get; set; }
    public bool isNeedTrackNumber { get; set; }
    public IEnumerable<StateModel> StatesOffer { get; set; }
}
