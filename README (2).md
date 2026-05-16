# SkillBridge
Knowledge Exchange Platform — Inefficient knowledge sharing and lack of peer learning incentives among students.

## Problem Description
Students often face academic and skill-related doubts but are unsure where or whom to ask. While existing platforms such as social media groups and messaging apps exist, they are typically unstructured, noisy, and lack focused academic support.

Although AI tools can provide quick general answers, they often fail to deliver context-specific guidance aligned with a student's syllabus, university requirements, assignment formats, and peer-level understanding.

SkillBridge addresses this gap by offering a community-driven peer learning platform where students can ask questions, share knowledge, and collaboratively solve academic problems. The platform encourages interaction between classmates and senior students who better understand the local academic context.

To promote active participation, SkillBridge introduces a point-based reward system that incentivizes users to help others. This not only improves engagement but also builds a reusable, structured knowledge base within the student community.

## Target Users
- University students
- Skill learners
- Learning communities

## Proposed Solution
SkillBridge is a full-stack system that allows users to:
- Create knowledge-sharing posts
- Create Questions
- Answer the Questions
- View all Questions and answers
- Answer and upvote posts
- Encourage participation through a point-based system

## Features
- User Registration & Login (JWT Authentication)
- Create, View, Update and Delete Posts
- Add Answers with optional image attachments
- Upvote Answers
- Mark Best Answer (awards bonus points)
- Leaderboard to track top contributors
- Category and status filtering
- MongoDB Database Integration
- RESTful APIs
- React Frontend

## Technologies Used

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- Multer (file uploads)

**Frontend**
- React 18
- React Router v6
- Tailwind CSS
- Vite

**Tools**
- Postman
- GitHub

## API Endpoints Tested using Postman

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive token |
| GET | `/api/auth/me` | Get logged-in user (token required) |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/` | Get all posts |
| GET | `/api/posts/:id` | Get a single post by ID |
| POST | `/api/posts/` | Create a post (token required) |
| PUT | `/api/posts/:id` | Update a post |
| DELETE | `/api/posts/:id` | Delete a post |
| POST | `/api/posts/:id/answers` | Add an answer (token required) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/leaderboard` | Get all users sorted by points |


## Frontend Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero section, recent posts, top contributors |
| Questions | `/questions` | Browse and filter all questions by category |
| Leaderboard | `/leaderboard` | Rankings of top contributors by points |
| Profile | `/profile` | Personal stats, badges, and activity |
| Login | `/login` | Login / Register |

To run the backend:
```bash
cd backend
npm install
npm start
```

To run the frontend:
```bash
cd frontend
npm install
npm start
```
Frontend runs on: http://localhost:3000

## Server Runs On
http://localhost:8000

## Status
Backend development completed.
Frontend development completed.
All core REST API endpoints implemented and tested via Postman.
