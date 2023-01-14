namespace IntermediarySearchService.Api.DtoModels;

public class ResponseModel
{
    public static string Success = "success";
    public static string Error = "error";
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