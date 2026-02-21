# Hiring Process Simplifier 🚀

A high-performance candidate management and hiring pipeline system. This platform streamlines recruitment with role-based access control, interactive analytics, and AI-powered candidate discovery.

---

## 🛠 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v4, Redux Toolkit, Lucide Icons.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Swagger UI.
- **AI**: NLP-based search service for semantic candidate discovery.

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- **Node.js**: v18 or higher.
- **MongoDB**: Local instance or MongoDB Atlas.

### 2. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd node-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your environment file:
   - Copy `.env.example` to `.env`.
   - Update `MONGO_URI` and `JWT_SECRET` with your credentials.
4. Launch the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your environment file:
   - Copy `.env.example` to `.env`.
   - Update `VITE_API_URL` (defaults to `http://localhost:5000/api`).
4. Launch the app:
   ```bash
   npm run dev
   ```

---

## 🔑 Environment Variables

### Backend (`node-backend/.env`)
| Variable | Description | Dummy Value |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB Connection String | `mongodb://localhost:27017/hiring` |
| `JWT_SECRET` | Secret for JWT hashing | `your_secret_key` |

### Frontend (`frontend/.env`)
| Variable | Description | Dummy Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base API endpoint | `http://localhost:5000/api` |

---

## 📖 API Documentation (Swagger)

The interactive API documentation is served directly from the backend. Once the backend is running, you can access it at:
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

---

## 🌐 Production Links

### 🖥️ Live Application (Frontend)
👉 **[https://candidatemgmt.netlify.app](https://candidatemgmt.netlify.app)**

### 📖 API Documentation (Backend)
👉 **[https://node-backend-a3wd27gl8-khushboovas-projects.vercel.app/api-docs/](https://node-backend-a3wd27gl8-khushboovas-projects.vercel.app/api-docs/)**

---

## 🌟 Key Features

- **Role-Based Workflows**:
  - **HR Dashboard**: Complete control over candidates, stages, and interviewer assignments. 
  - **Interviewer Portal**: Restricted view showing only assigned candidates scheduled for rounds.
- **Visual Hiring Pipeline**: Drag-and-drop style stage tracking from "Screening" to "Offer".
- **AI Search**: Search using natural language (e.g., *"Show me candidates with React skills pending L1"*).
- **Automated Alerts**: Visual highlighting for candidates "stuck" in a stage for more than 2 days.
- **Interactive Stats**: Dynamic filtering of candidates based on stage statistics cards.

---

## 👥 Test Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **HR (Admin)** | `admin@talenthub.com` | `123456` |
| **Interviewer** | `interviewer@talenthub.com` | `123456` |
