# Task Manager CRUD App

A full-stack, production-ready CRUD application built using the Next.js App Router ecosystem. It features a complete JWT-based authentication flow and an interactive dashboard for managing tasks seamlessly.

---

## 🚀 Tech Stack
- **Frontend**: Next.js 15+ (App Router), React 19, Tailwind CSS, Lucide React (Icons), React Hot Toast
- **Backend**: Next.js API Routes (Serverless)
- **Database**: MongoDB & Mongoose
- **Authentication**: JWT (JSON Web Tokens) with HttpOnly Cookies
- **Language**: TypeScript (Strict Mode)

---

## ✨ Features
- **Authentication**: Secure Register, Login, and Logout flows.
- **Task Management**: Create, Read, Update, and Delete (CRUD) operations.
- **Task Filtering**: Filter tasks by their current status (Pending, In-Progress, Completed).
- **Responsive UI**: Clean, mobile-friendly interface styled with Tailwind CSS.

---

## 🛠️ Technical Decisions

1. **Next.js App Router (Full-stack Monolith)**
   - *Decision*: Next.js was chosen to serve both the frontend UI and the backend API routes.
   - *Reason*: This provides a highly cohesive developer experience, sharing TypeScript interfaces natively between the client and server without needing a separate backend repository.

2. **JWT via HttpOnly Cookies**
   - *Decision*: Authentication tokens are stored inside HttpOnly cookies rather than `localStorage`.
   - *Reason*: This mitigates Cross-Site Scripting (XSS) vulnerabilities, as the token cannot be accessed via malicious JavaScript on the client side.

3. **Mongoose Model Caching**
   - *Decision*: All database models (e.g., `User`, `Task`) utilize a caching pattern: `mongoose.models.Task || mongoose.model('Task', schema)`.
   - *Reason*: Next.js heavily utilizes Hot Module Replacement (HMR) during development and multi-threaded prerendering during builds. This caching mechanism prevents fatal `OverwriteModelError` crashes by ensuring schemas are only registered once per runtime environment.

4. **Context API for State Management**
   - *Decision*: `TaskContext` is used to manage the global state of the dashboard tasks.
   - *Reason*: Avoids prop-drilling for deeply nested modals (`TaskForm`, `DeletePopCard`) while remaining lightweight without introducing heavier dependencies like Redux or Zustand.

---

## ⚖️ Tradeoffs & Assumptions

### Tradeoffs
- **Client-Side Data Fetching vs SSR**: The dashboard currently utilizes client-side data fetching (`useEffect`) combined with Context API hydration. While Server-Side Rendering (SSR) offers faster initial payload times, this client-heavy approach was prioritized to support instant optimistic UI updates and rich interactivity (modals, filters) without requiring full page reloads.
- **Tightly Coupled Backend**: Running API routes natively inside Next.js means backend tasks (like long-running cron jobs or heavy processing) share the same serverless constraints as the frontend. 

### Assumptions
- **Database Availability**: Assumes a valid MongoDB connection string (`MONGODB_URL`) is provided and that the cluster allows inbound connections.
- **Environment Secrets**: Assumes a secure `TOKEN_SECRET` is defined in the environment variables for signing and verifying JSON Web Tokens.

---

## 💻 How to Run Locally

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/Siddarth474/next-task-manager.git
   cd next-task-manager
   ```

2. **Install Dependencies**  
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**  
   Create a `.env` file in the root directory and add the following keys:
   ```env
   MONGODB_URL=your_mongodb_connection_string
   TOKEN_SECRET=your_super_secret_jwt_key
   ```

4. **Run the Development Server**  
   ```bash
   npm run dev
   ```

5. **Access the App**  
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Scaling for Production
1. **Deployment:** Host easily on Vercel, which natively optimizes Next.js App Router frontend and serverless API endpoints.
2. **Database:** Use a managed, auto-scaling database service like MongoDB Atlas.
3. **Security:** Implement rate limiting (e.g., via Upstash Redis) on authentication endpoints to prevent brute-force attacks.
4. **Performance:** Shift static assets to a CDN and leverage Next.js native Image optimization.
