using Ardalis.Specification;

namespace IntermediarySearchService.Core.Interfaces;

public interface IReadRepository<T> : IReadRepositoryBase<T> where T : class, IAggregateRoot
{ }
