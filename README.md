# Blog System

A full-stack blogging platform with a Spring Boot REST API and a React frontend. Users can create and manage blog posts, comment on and like posts, follow other users, update profiles, and use authentication and password-reset flows. The backend also includes protected admin functionality and OpenAPI documentation.

## Tech Stack

- **Backend:** Java 21, Spring Boot 4.1.1, Spring Web MVC, Spring Data JPA, Spring Security
- **Database:** MySQL
- **Authentication:** JWT
- **Email:** Spring Mail with SMTP
- **API documentation:** Springdoc OpenAPI
- **Frontend:** React 18, React Router, Vite

## Features

- User registration and login
- JWT-based authentication and protected routes
- Create, edit, view, and delete blog posts
- Search and browse the blog feed
- Comments and likes
- Follow and follower management
- User profiles and settings
- Password reset by email
- Admin panel
- Light and dark themes
- Responsive React interface

## Prerequisites

Install the following before running the project:

- Java 21 or newer
- Maven 3.9+ (or use the included Maven wrapper)
- MySQL 8+
- Node.js 18+
- npm

## Database Setup

Create the application database in MySQL:

```sql
CREATE DATABASE blog_system;
```

Update the database and mail settings in:

```text
Blog-System copy/src/main/resources/application.properties
```

At minimum, configure these values for your environment:

```properties
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
jwt.secret=your_long_random_jwt_secret
spring.mail.username=your_email_address
spring.mail.password=your_email_app_password
```

Do not commit real passwords, API keys, JWT secrets, or email credentials to GitHub. For production, prefer environment variables or an external secrets manager.

## Run the Backend

From the repository root:

```bash
cd "Blog-System copy"
./mvnw spring-boot:run
```

On Windows, use:

```bat
mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:1912
```

OpenAPI documentation is available at:

```text
http://localhost:1912/swagger-ui/index.html
```

## Run the Frontend

Open a second terminal from the repository root:

```bash
cd folio-react
npm install
npm run dev
```

Then open the local URL printed by Vite, normally:

```text
http://localhost:5173
```

The frontend uses `http://localhost:1912` as its default API URL. To use a different backend URL, create `folio-react/.env` with:

```env
VITE_API_BASE_URL=http://localhost:1912
```

## Build the Frontend

```bash
cd folio-react
npm run build
npm run preview
```

The production files are generated in `folio-react/dist`.

## Run Backend Tests

```bash
cd "Blog-System copy"
./mvnw test
```

## Project Structure

```text
.
├── Blog-System copy/       # Spring Boot backend
│   ├── src/main/java/      # REST controllers, services, repositories, security
│   ├── src/main/resources/ # Application configuration
│   └── src/test/java/      # Backend tests
├── folio-react/            # React frontend
│   ├── src/api/            # API client and endpoint functions
│   ├── src/components/     # Reusable UI components
│   ├── src/context/        # Authentication, theme, toast, and confirmation state
│   └── src/pages/          # Application pages and routes
└── README.md
```

## Contributing

1. Create a feature branch.
2. Make and test your changes.
3. Keep credentials and local configuration out of commits.
4. Open a pull request with a clear description of the change.
