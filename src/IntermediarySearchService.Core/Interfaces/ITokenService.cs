
namespace IntermediarySearchService.Core.Interfaces;

public interface ITokenService
{
    Task<string> GetTokenAsync(string userName);
}
