﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace IntermediarySearchService.Infrastructure.Identity;

public class IdentityDbContext : IdentityDbContext<ApplicationUser>
{
    public IdentityDbContext(DbContextOptions<IdentityDbContext> options)
    : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ApplicationUser>(entity => entity.ToTable("Users"));

        builder.Entity<UserAddress>(entity => entity.ToTable("Addresses"));

        builder.Entity<IdentityRole>(entity => entity.ToTable("Roles"));

        builder.Entity<IdentityUserRole<string>>(entity => entity.ToTable("UserRoles"));

        builder.Entity<IdentityUserClaim<string>>(entity => entity.ToTable("UserClaims"));

        builder.Entity<IdentityUserLogin<string>>(entity => entity.ToTable("UserLogins"));

        builder.Entity<IdentityUserToken<string>>(entity => entity.ToTable("UserTokens"));

        builder.Entity<IdentityRoleClaim<string>>(entity => entity.ToTable("RoleClaims"));

        builder.Entity<ApplicationUser>()
            .HasMany(u => u.Addresses)
            .WithOne()
            .OnDelete(DeleteBehavior.Cascade);
    }
}
