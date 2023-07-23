using System.Linq.Expressions;

namespace IntermediarySearchService.Core.Interfaces;

public interface IRepository<T> where T : IAggregateRoot
{
    Task<T> AddAsync(T entity);

    Task UpdateAsync(T entity);

    Task DeleteAsync(T entity);

    Task DeleteRangeAsync(IEnumerable<T> entities);

    Task<T> SearchOneAsync(Expression<Func<T, bool>> predicate);

    Task<List<T>> SearchManyAsync(Expression<Func<T, bool>> predicate);

    Task<List<T>> GetAllAsync();
}
