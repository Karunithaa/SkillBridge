# SkillBridge
Knowledge Exchange Platform, Inefficient knowledge sharing and lack of peer learning incentives among students.


## Problem Description

Students often face academic and skill-related doubts but are unsure where or whom to ask. While existing platforms such as social media groups and messaging apps exist, they are typically unstructured, noisy, and lack focused academic support.

Although AI tools can provide quick general answers, they often fail to deliver context-specific guidance aligned with a student’s syllabus, university requirements, assignment formats, and peer-level understanding.

SkillBridge addresses this gap by offering a community-driven peer learning platform where students can ask questions, share knowledge, and collaboratively solve academic problems. The platform encourages interaction between classmates and senior students who better understand the local academic context.

To promote active participation, SkillBridge introduces a point-based reward system that incentivizes users to help others. This not only improves engagement but also builds a reusable, structured knowledge base within the student community.


## Target Users

- University students
- Skill learners
- Learning communities


## Proposed Solution

SkillBridge is a REST API based system that allows users to:
- Create knowledge-sharing posts
- View all posts
- Update posts
- Delete posts
- Encourage participation through a point-based system


## Features

- Create Posts
- Fetch All Posts
- Update Posts
- Delete Posts
- MongoDB Database Integration
- RESTful APIs


## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Postman
- GitHub


## API Endpoints

GET All Posts
GET /api/posts/getallposts

CREATE Post
POST /api/posts/create

UPDATE Post
PUT /api/posts/update/:id

DELETE Post
DELETE /api/posts/delete/:id


## Server Runs On
http://localhost:8000


## Status
Backend development completed.
All core REST API endpoints are implemented and tested locally.