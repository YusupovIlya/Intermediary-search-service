using Ardalis.Specification.EntityFrameworkCore;
using IntermediarySearchService.Core.Interfaces;

namespace IntermediarySearchService.Infrastructure.Data;

public class EfRepository<T> : RepositoryBase<T>, IReadRepository<T>, 
                               IRepository<T> where T : class, IAggregateRoot
{
    public EfRepository(AppDbContext dbContext) : base(dbContext) { }
}