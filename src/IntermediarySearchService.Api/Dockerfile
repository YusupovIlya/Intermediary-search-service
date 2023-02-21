#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["src/IntermediarySearchService.Api/IntermediarySearchService.Api.csproj", "IntermediarySearchService.Api/"]
COPY ["src/IntermediarySearchService.Infrastructure/IntermediarySearchService.Infrastructure.csproj", "IntermediarySearchService.Infrastructure/"]
COPY ["src/IntermediarySearchService.Core/IntermediarySearchService.Core.csproj", "IntermediarySearchService.Core/"]
RUN dotnet restore "IntermediarySearchService.Api/IntermediarySearchService.Api.csproj"
COPY ["src/", "./"]

WORKDIR "IntermediarySearchService.Api"
RUN dotnet build "IntermediarySearchService.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "IntermediarySearchService.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "IntermediarySearchService.Api.dll"]