using Ardalis.Specification;

namespace IntermediarySearchService.Core.Interfaces;

public interface IRepository<T> : IRepositoryBase<T> where T : class, IAggregateRoot
{ }
