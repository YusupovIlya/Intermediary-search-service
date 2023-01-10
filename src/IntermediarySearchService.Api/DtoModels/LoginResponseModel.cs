namespace IntermediarySearchService.Api.DtoModels;

public class LoginResponseModel: ResponseModel
{
    public UserModel User { get; set; }
    public string Token { get; set; }
    public LoginResponseModel(string id): base(id)
    {}
}

public class UserModel
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public UserModel(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName;
    }
}
