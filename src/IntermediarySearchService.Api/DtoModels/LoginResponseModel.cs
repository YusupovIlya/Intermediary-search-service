namespace IntermediarySearchService.Api.DtoModels;

public class LoginResponseModel: ResponseModel
{
    public UserModel? User { get; set; }
    public string? Token { get; set; }
    public LoginResponseModel()
    {}
}

public class UserModel
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Role { get; set; }
    public UserModel(string firstName, string lastName, 
                     string role)
    {
        FirstName = firstName;
        LastName = lastName;
        Role = role;
    }
}
