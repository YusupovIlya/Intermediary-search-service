using IntermediarySearchService.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace IntermediarySearchService.Infrastructure.Data.DataAccess;

public class EfRepository<T> : 
             IRepository<T> where T : 
             class, IAggregateRoot
{
    private readonly AppDbContext _dbContext;

    public EfRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<T> AddAsync(T entity)
    {
        await _dbContext.Set<T>().AddAsync(entity);
        await _dbContext.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(T entity)
    {
        _dbContext.Set<T>().Update(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(T entity)
    {
        _dbContext.Set<T>().Remove(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteRangeAsync(IEnumerable<T> entities)
    {
        _dbContext.Set<T>().RemoveRange(entities);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<T> SearchOneAsync(Expression<Func<T, bool>> predicate)
    {
        var result = await _dbContext.Set<T>().SingleOrDefaultAsync(predicate);
        return result;
    }

    public async Task<List<T>> SearchManyAsync(Expression<Func<T, bool>> predicate)
    {
        var result = await _dbContext.Set<T>().Where(predicate).ToListAsync();
        return result;
    }

    public async Task<List<T>> GetAllAsync()
    {
        var result = await _dbContext.Set<T>().ToListAsync();
        return result;
    }
}
