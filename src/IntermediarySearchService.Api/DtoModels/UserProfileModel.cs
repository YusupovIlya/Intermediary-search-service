﻿namespace IntermediarySearchService.Api.DtoModels;

public class UserProfileModel
{
    public string? Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string AdditionalContact { get; set; }
}

public class UserProfileForAdminModel : UserProfileModel
{
    public string Id { get; set; }
    public string LockoutEnd { get; set; }
}