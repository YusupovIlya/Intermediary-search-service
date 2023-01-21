using IntermediarySearchService.Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IntermediarySearchService.Infrastructure.Configurations;

public class OrderConfigurations : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        var navigation = builder.Metadata.FindNavigation(nameof(Order.OrderItems));

        navigation?.SetPropertyAccessMode(PropertyAccessMode.Field);

        builder
            .HasMany(o => o.OrderItems)
            .WithOne()
            .OnDelete(DeleteBehavior.Cascade);
     
        builder
            .Property(o => o.UserName)
            .IsRequired()
            .HasMaxLength(20);

        builder
            .Property(o => o.SiteName)
            .IsRequired()
            .HasMaxLength(100);

        builder
            .Property(o => o.SiteLink)
            .IsRequired()
            .HasMaxLength(256);

        builder
            .Property(o => o.PerformerFee)
            .IsRequired()
            .HasColumnType("decimal(8,2)");


        builder
            .OwnsMany(a => a.StatesOrder, c =>
        {
            c.WithOwner().HasForeignKey("OwnerId");
            c.Property<int>("Id");
            c.HasKey("Id");
        });

        builder
            .OwnsOne(o => o.Address);
    }
}
