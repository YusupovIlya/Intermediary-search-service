namespace IntermediarySearchService.Api.DtoModels;

public class PaginationMetaModel
{
    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public bool HasPrevious { get; set; }
    public bool HasNext { get; set; }
    public PaginationMetaModel(int currentPage, int totalPages, int pageSize, 
                               int totalCount, bool hasPrevious, bool hasNext)
    {
        CurrentPage = currentPage;
        TotalPages = totalPages;
        PageSize = pageSize;
        TotalCount = totalCount;
        HasPrevious = hasPrevious;
        HasNext = hasNext;
    }
}
