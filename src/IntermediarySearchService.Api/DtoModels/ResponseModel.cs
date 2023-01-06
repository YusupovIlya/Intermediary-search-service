namespace IntermediarySearchService.Api.DtoModels;

public class ResponseModel
{
    public int Id { get; set; }
    public string Message { get; set; }
    public ResponseModel(int id, string message)
    {
        Id = id;
        Message = message;
    }
}
