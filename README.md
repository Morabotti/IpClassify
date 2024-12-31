# IP Classifier
Classify and analyze network traffic to applications. Track a specific users and devices across the multiple sites in real time. 

Proof of concept / practice project to use reactive Java. Main focus of the project is to show understanding of used technologies.

#### Backend technologies
* JDK 21
* Spring WebFlux
* ElasticSearch
* Kafka
* Redis

#### Frontend technologies
* Node +20
* Typescript
* React 19

### How to run

Backend and frontend run separately. Running all of the dependencies on docker will take around 10gb of ram.

#### Backend:
1. Have JDK 21 and Maven installed
2. Have needed services or host them yourself with `docker-compose up`
3. Run the application with `mvn spring-boot:run`
4. API exposed on port 8080

#### Frontend:
1. Have at least Node 20
2. Install dependencies with `npm install` or `yarn`
3. Run `npm run serve` to serve locally. Build frontend with `npm run build` 
4. Frontend is hosted on port 8082

Default username is `tester` and password is `1234`. These are configurable in `application.properties` or with environment variables.
