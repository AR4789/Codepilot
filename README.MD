# 🤖 CodePilot

CodePilot is an AI-powered code review platform built with **React** and **Spring Boot**. It allows developers to review individual code snippets or analyze full GitHub repositories using LLMs like OpenAI or Ollama. It features authentication, a credit-based system, and a modern, responsive UI.

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- Maven
- MongoDB or PostgreSQL
- OpenAI or Ollama API Key

---

### 🛠 Backend Setup (Spring Boot)

```bash
cd backend
# Configure database and JWT in application.properties
mvn clean install
mvn spring-boot:run
```

---

### 💻 Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

Make sure the backend is running at `http://localhost:8080`.

---

## 📦 Environment Variables

### Backend (`src/main/resources/application.properties`)

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/codepilot
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password
jwt.secret=your_secret_key
app.cors.allowed-origins=http://localhost:5173
openai.api.key=your_openai_or_ollama_api_key
```

### Frontend (`.env` in `/frontend`)

```env
VITE_API_URL=http://localhost:8080
```

---

## 🧠 Features

- AI-powered code review (supports JavaScript, Java, Python, etc.)
- Full GitHub repo analysis via link
- OAuth2 login with Google
- Credit system to limit reviews
- Token-based authentication
- Clean modern UI with toast notifications
- Mobile-responsive frontend

---

## 🔐 Authentication

- JWT-based authentication for email/password login
- OAuth2 login via Google
- Secure API access using tokens
- Credit-check enforced before review

---

## 🔁 API Endpoints

### Auth

| Method | Endpoint             | Description             |
|--------|----------------------|-------------------------|
| POST   | `/api/auth/register` | Register new user       |
| POST   | `/api/auth/login`    | Login existing user     |
| GET    | `/api/user/me`       | Get logged in user info |

### Code Review

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| POST   | `/api/review`         | Review submitted code snippet      |
| POST   | `/api/review/github`  | Review full GitHub repository link |

### Credits

| Method | Endpoint               | Description                   |
|--------|------------------------|-------------------------------|
| GET    | `/api/credits`         | Get current credit balance    |
| POST   | `/api/credits/deduct`  | Deduct credit after reviewing |

---

## 🧪 Sample Payloads

### Code Snippet Review

```json
POST /api/review
{
  "code": "public class HelloWorld { public static void main(String[] args) { System.out.println(\"Hello\"); } }",
  "language": "java"
}
```

### GitHub Repo Review

```json
POST /api/review/github
{
  "repoUrl": "https://github.com/username/repo-name"
}
```

---

## 🗂️ Project Structure

```bash
codepilot/
├── backend/                # Spring Boot backend
│   ├── src/main/java/com/example/codepilot
│   ├── src/main/resources
│   └── pom.xml
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
└── README.md
```

---

## 📸 Screenshots

- Login / Register
- Review interface with code editor
- GitHub review result with inline feedback
- Profile with credits
- OAuth2 login with Google

---

## 🤖 Tech Stack

**Frontend**:  
- React + Vite  
- Tailwind CSS  
- Axios, React Router  
- Toastify

**Backend**:  
- Spring Boot  
- Spring Security + JWT  
- OAuth2 (Google)  
- MongoDB / PostgreSQL  
- OpenAI / Ollama API Integration

---

## 📈 Future Enhancements

- Dark mode support
- GitHub repo auto-fetch via OAuth
- Comment inline on PRs
- Subscription model integration
- Admin dashboard to manage users and credits

---

## 📄 License

Feel free to use, contribute, and share!

---

## 🙌 Acknowledgements

- [OpenAI](https://openai.com/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://reactjs.org/)
- [Ollama](https://ollama.com)
