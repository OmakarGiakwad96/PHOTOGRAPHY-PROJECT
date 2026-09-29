# Stage 1: Build the .NET application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
# Copy csproj and restore as distinct layers
COPY ["PhotoHub.Api.csproj", "./"]
RUN dotnet restore "./PhotoHub.Api.csproj"
# Copy everything else and build
COPY . .
RUN dotnet publish "PhotoHub.Api.csproj" -c Release -o /app/publish

# Stage 2: Serve the application
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "PhotoHub.Api.dll"]
