using IntermediarySearchService.Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IntermediarySearchService.Infrastructure.Data.Configurations;

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder
            .Property(oi => oi.ProductLink)
            .IsRequired()
            .HasMaxLength(512);

        builder
            .Property(oi => oi.ProductName)
            .IsRequired()
            .HasMaxLength(512);

        builder
            .Property(oi => oi.Options)
            .IsRequired()
            .HasMaxLength(100);

        builder
            .Property(oi => oi.UnitPrice)
            .IsRequired()
            .HasColumnType("decimal(8,2)");
    }
}
