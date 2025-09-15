FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the Spring Boot JAR file into the container
# Assuming your build tool (Maven/Gradle) outputs the JAR to 'target' or 'build/libs'
# Replace 'your-spring-boot-app.jar' with the actual name of your built JAR file
# (e.g., 'gs-spring-boot-0.0.1-SNAPSHOT.jar' or 'my-app.jar')
COPY build/libs/hanki-backend-0.1.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]