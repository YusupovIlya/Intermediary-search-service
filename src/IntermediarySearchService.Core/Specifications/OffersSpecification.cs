using Ardalis.Specification;
using IntermediarySearchService.Core.Entities.OfferAggregate;

namespace IntermediarySearchService.Core.Specifications;

public sealed class OffersSpecification : Specification<Offer>
{
    public OffersSpecification(string userName)
    {
        Query.Where(of => of.UserName == userName && of.Deleted == null);
    }
}
