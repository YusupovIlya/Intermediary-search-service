namespace IntermediarySearchService.Api.DtoModels;

public class ResponseModel
{
    public string Id { get; set; }
    public string Message { get; set; }
    public ResponseModel(string id)
    {
        Id = id;
    }
    public ResponseModel(string id, string message)
    {
        Id = id;
        Message = message;
    }
}
