using Ardalis.Specification;
using IntermediarySearchService.Core.Entities.OfferAggregate;

namespace IntermediarySearchService.Core.Specifications;

public class OfferSpecification : Specification<Offer>, ISingleResultSpecification
{
    public OfferSpecification(int id)
    {
        Query.Where(of => of.Id == id);
    }
}
