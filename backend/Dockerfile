# syntax=docker/dockerfile:1

# --- build stage ---
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copy wrapper + build scripts first so dep resolution layer caches
# independently of source changes.
COPY gradlew settings.gradle build.gradle ./
COPY gradle ./gradle
RUN chmod +x gradlew

COPY src ./src

# Cache mounts persist the Gradle distribution + downloaded deps across
# builds, so only the first build pays the download cost.
RUN --mount=type=cache,target=/root/.gradle \
    ./gradlew --no-daemon clean bootJar -x test

# --- runtime stage ---
FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd -r -u 1001 spring
COPY --from=build /app/build/libs/app-0.0.1-SNAPSHOT.jar app.jar
USER spring
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
