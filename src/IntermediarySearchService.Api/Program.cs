using IntermediarySearchService.Core.Interfaces;
using IntermediarySearchService.Core.Services;
using IntermediarySearchService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using IntermediarySearchService.Api;
using IntermediarySearchService.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using IntermediarySearchService.Infrastructure.Services;
using System.Reflection;
using IntermediarySearchService.Api.Services;
using Microsoft.AspNetCore.Authorization;
using IntermediarySearchService.Infrastructure.Interfaces;
using IntermediarySearchService.Infrastructure.Models;

var builder = WebApplication.CreateBuilder(args);


var clientURL = builder.Configuration.GetSection("CLIENT_URL").Value;
builder.Services.AddCors(options => options.AddPolicy("CorsPolicy",
    builder =>
    {
        builder
            .WithOrigins(clientURL)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    }));
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(c => c.UseNpgsql(builder.Configuration.GetConnectionString("AppDbContext")));
builder.Services.AddDbContext<IdentityDbContext>(c => c.UseNpgsql(builder.Configuration.GetConnectionString("IdentityDbContext")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(opts =>
                {
                    opts.User.RequireUniqueEmail = true;
                    opts.Password.RequireNonAlphanumeric = false;
                    opts.Password.RequiredLength = 5;
                    opts.SignIn.RequireConfirmedEmail = true;
                })
                .AddEntityFrameworkStores<IdentityDbContext>()
                .AddDefaultTokenProviders();


builder.Services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));
builder.Services.AddScoped(typeof(IReadRepository<>), typeof(EfRepository<>));
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IOfferService, OfferService>();

builder.Services.AddScoped<ITokenService, IdentityTokenClaimService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthorizationHandler, OwnerAuthorizationHandler>();

builder.Services.AddScoped<EntityNotFoundExceptionFilter>();
builder.Services.AddScoped<EntityStateChangeExceptionFilter>();


builder.Services.Configure<MailSettings>(builder.Configuration.GetSection(nameof(MailSettings)));
builder.Services.AddTransient<IEmailService, EmailService>();

var key = builder.Configuration.GetSection("JWT_SECRET_KEY").Value;
var encodedKey = Encoding.ASCII.GetBytes(key);
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(config =>
    {
        config.RequireHttpsMetadata = false;
        config.SaveToken = true;
        config.TokenValidationParameters = new TokenValidationParameters
        {
            IssuerSigningKey = new SymmetricSecurityKey(encodedKey),
            ValidateIssuerSigningKey = true,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = "IntermediarySearchService",
            ValidAudience = "FrontApp",
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("OwnerEntity", policy =>
        policy.Requirements.Add(new SameOwnerRequirement()));
});

builder.Services.Configure<RouteOptions>(options => options.LowercaseUrls = true);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opt =>
{
    opt.SwaggerDoc("v1", new OpenApiInfo { Title = "MyApp", Version = "v1" });
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    opt.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
builder.Services.AddAutoMapper(typeof(MappingProfile));


var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var scopedProvider = scope.ServiceProvider;
    try
    {
        var userManager = scopedProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scopedProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var identityContext = scopedProvider.GetRequiredService<IdentityDbContext>();
        var dbContext = scopedProvider.GetRequiredService<AppDbContext>();
        var config = builder.Configuration;
        await IdentityDbContextSeed.SeedAsync(identityContext, userManager, roleManager, config);
        if (dbContext.Database.IsNpgsql())
        {
            dbContext.Database.Migrate();
        }
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "An error occurred seeding the DB.");
    }
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
