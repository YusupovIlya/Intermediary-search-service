using IntermediarySearchService.Core.Entities.OfferAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IntermediarySearchService.Infrastructure.Data.Configurations;

public class OfferConfiguration : IEntityTypeConfiguration<Offer>
{
    public void Configure(EntityTypeBuilder<Offer> builder)
    {
        builder
            .Property(of => of.ItemsTotalCost)
            .IsRequired()
            .HasColumnType("decimal(8,2)");

        builder
            .Property(of => of.DeliveryCost)
            .IsRequired()
            .HasColumnType("decimal(8,2)");

        builder
            .Property(of => of.Expenses)
            .IsRequired(false)
            .HasColumnType("decimal(8,2)");

        builder
            .Property(of => of.isSelected)
            .HasDefaultValue(false);

        builder
            .OwnsMany(a => a.StatesOffer, c =>
            {
                c.WithOwner().HasForeignKey("OwnerId");
                c.Property<int>("Id");
                c.HasKey("Id");
            });
    }
}
