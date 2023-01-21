using IntermediarySearchService.Core.Entities.OrderAggregate;

namespace IntermediarySearchService.Core.Interfaces;

public interface IUserService
{
    Task<IEnumerable<Address>> GetUserAddresses(string email);
    Task AddNewAddressToUser(string email, Address newAddress);
    Task DeleteAddress(string email, Address address);
}
