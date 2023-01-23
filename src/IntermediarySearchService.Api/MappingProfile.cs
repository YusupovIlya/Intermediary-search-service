using AutoMapper;
using IntermediarySearchService.Api.DtoModels;
using IntermediarySearchService.Core.Entities.OrderAggregate;

namespace IntermediarySearchService.Api;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Order, NewOrderModel>();
        CreateMap<Order, OrderModel>()
            .ForMember(dest => dest.StatesOrder,
                       opt => opt.MapFrom(src =>
                       src.StatesOrder.Select(s =>
                       new StateModel(StateOrder.GetDescription(s.State), s.Description,
                                      $"{s.Date.Value.ToShortDateString()} {s.Date.Value.ToShortTimeString()}"))))
            .ForMember(dest => dest.TotalPrice,
                       opt => opt.MapFrom(src => src.TotalOrderPrice()));
    }
}
