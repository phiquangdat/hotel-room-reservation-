# --- Stage 1: Build the application ---
# Use a Maven image with Java 17 to build the project
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml first to leverage Docker's layer caching.
# If pom.xml doesn't change, dependencies won't be re-downloaded.
COPY pom.xml ./
RUN mvn dependency:go-offline

# Copy the rest of the source code
COPY src ./src

# Package the application, skipping the tests
RUN mvn clean package -DskipTests

# --- Stage 2: Create the final, slim image ---
FROM eclipse-temurin:21-jre-jammy

# Set the working directory
WORKDIR /app

# Copy the packaged .jar file from the 'builder' stage
# Renaming it to app.jar for a consistent name
COPY --from=builder /app/target/*.jar app.jar

# Expose the port the application runs on
EXPOSE 8080

# The command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

