namespace IntermediarySearchService.Api.DtoModels;

public class LoginResponseModel: ResponseModel
{
    public string? Token { get; set; }
    public string Role { get; set; }
    public string Email { get; set; }
    public LoginResponseModel()
    {}
}