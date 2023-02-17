using AutoMapper;
using IntermediarySearchService.Api.DtoModels;
using IntermediarySearchService.Core.Entities.OfferAggregate;
using IntermediarySearchService.Core.Entities.OrderAggregate;
using IntermediarySearchService.Infrastructure.Identity;

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
                       new StateModel(s.State, StateOrder.GetDescription(s.State), s.Description,
                                      $"{s.Date.Value.ToShortDateString()} {s.Date.Value.ToShortTimeString()}"))))
            .ForMember(dest => dest.TotalPrice,
                       opt => opt.MapFrom(src => src.TotalOrderPrice()));

        CreateMap<Offer, OfferModel>()
            .ForMember(dest => dest.Deleted,
                       opt => opt.MapFrom(src => 
                       src.Deleted == null ? "": $"{src.Deleted.Value.ToShortDateString()} {src.Deleted.Value.ToShortTimeString()}"))
            .ForMember(dest => dest.StatesOffer,
                       opt => opt.MapFrom(src =>
                       src.StatesOffer.Select(s =>
                       new StateModel(s.State, StateOrder.GetDescription(s.State),
                                      $"{s.Date.Value.ToShortDateString()} {s.Date.Value.ToShortTimeString()}"))));
        
        CreateMap<ApplicationUser, UserProfileModel>();
        CreateMap<ApplicationUser, UserProfileForAdminModel>()
            .ForMember(dest => dest.LockoutEnd,
                       opt => opt.MapFrom(src => src.LockoutEnd.HasValue ? $"{src.LockoutEnd.Value.DateTime.ToString("MM/dd/yyyy HH:mm")}" : ""));
    }
}
