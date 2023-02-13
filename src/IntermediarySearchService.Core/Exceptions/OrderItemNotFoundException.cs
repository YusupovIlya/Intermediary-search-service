namespace IntermediarySearchService.Core.Exceptions;

public class OrderItemNotFoundException : EntityNotFoundException
{
    public OrderItemNotFoundException(int itemId) : base($"Item doesn't found with id = {itemId}")
    { }
}
