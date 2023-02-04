namespace IntermediarySearchService.Api.DtoModels;

public class PaginatedOrdersModel
{
    public PaginationMetaModel PaginationMeta { get; set; }
    public IEnumerable<OrderModel> Orders { get; set; }
    public PaginatedOrdersModel(PaginationMetaModel meta, IEnumerable<OrderModel> orders)
    {
        PaginationMeta = meta;
        Orders = orders;
    }
}
