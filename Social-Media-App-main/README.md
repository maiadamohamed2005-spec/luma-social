# Luma Social Media App — Frontend

> 🚧 This project is currently under active development.

A modern, responsive social media application frontend built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **TanStack React Query**.

The application provides a complete social networking experience including posts, friendships, real-time messaging, notifications, stories, and an AI-powered post assistant.

This repository contains the **frontend application** and communicates with a separate **Laravel REST API backend**.

---

## Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **TanStack React Query**
- **Laravel Echo / Reverb** for real-time communication
- **REST API**
- **Git & GitHub**

---

## Features

### Authentication

- User registration
- User login and logout
- Token-based authentication
- Protected routes
- Persistent authentication session
- Forgot password
- Reset password
- Backend validation error handling

### User Profiles

- User profile pages
- Profile information
- Profile statistics
- Avatar upload
- Cover image upload
- User media section
- Own-profile and other-user profile states

### Posts

- Create posts
- Image posts
- Video attachments
- View posts
- Update and delete posts
- Likes
- Comments
- Replies
- Comment likes
- Infinite scrolling feed
- Loading and error states

### Friends

- Send friend requests
- Accept friend requests
- Reject friend requests
- Cancel outgoing requests
- Remove friends
- Friends list
- Incoming and outgoing friend requests

### Notifications

- Notifications list
- Unread notification count
- Mark notifications as read
- Real-time notification updates

### Real-Time Messaging

- Conversations
- Private messaging
- Send messages
- Edit messages
- Delete messages
- Mark conversations as read
- Real-time message updates using Laravel Reverb

### Stories

- Create image and video stories
- Story captions
- Public and friends-only visibility
- Multiple stories per user
- Story viewer
- Automatic story progress
- Image and video playback
- Next and previous story navigation
- Keyboard navigation
- Pause and resume interaction
- Seen / unseen story states
- Story view tracking
- Story viewers list
- Viewer timestamps
- Delete own stories
- Custom delete confirmation dialog
- Loading and media error states
- Responsive story interface

### AI Post Assistant

- Generate social media posts using AI
- Enter a topic, idea, or message
- Choose a writing tone:
  - Professional
  - Casual
  - Friendly
  - Educational
- Generate posts in:
  - English
  - Arabic
- Regenerate generated content
- Loading and error handling
- Desktop assistant in the right sidebar
- Responsive mobile/tablet AI bottom sheet
- AI generation is processed securely through the Laravel backend

### Responsive UI

- Responsive three-column desktop layout
- Adaptive tablet and mobile layouts
- Responsive story viewer
- Mobile AI assistant
- Reusable loading skeletons
- Consistent purple application theme
- Interactive hover and focus states

---

## Project Structure

```text
src/
├── api/
│   ├── auth.ts
│   ├── stories.ts
│   ├── ai.ts
│   └── ...
│
├── app/
│   └── ...
│
├── components/
│   ├── ai/
│   ├── common/
│   ├── layout/
│   ├── post/
│   ├── profile/
│   └── stories/
│
├── context/
│   └── AuthContext.tsx
│
├── hooks/
│   ├── ai/
│   ├── auth/
│   ├── friends/
│   ├── messages/
│   ├── notifications/
│   ├── posts/
│   ├── profile/
│   ├── shared/
│   └── stories/
│
├── lib/
│   └── api.ts
│
└── types/
    └── ...
```

The frontend follows a modular structure that separates:

- API communication
- React Query hooks
- UI components
- Authentication state
- Shared utilities
- TypeScript types

---

## Frontend Architecture

The application uses a layered frontend architecture:

```text
UI Components
      ↓
Custom React Query Hooks
      ↓
API Layer
      ↓
Laravel REST API
```

For real-time features:

```text
Next.js Client
      ↕
Laravel Echo
      ↕
Laravel Reverb
```

For AI post generation:

```text
AI Post Assistant
      ↓
Frontend API Layer
      ↓
Laravel AI Endpoint
      ↓
AI Provider
```

API credentials and AI provider keys are never exposed in the frontend.

---

## Backend

The frontend communicates with a separate Laravel REST API that handles authentication, application data, real-time events, media storage, stories, messaging, notifications, and AI post generation.

**Backend Repository:**

https://github.com/MohamadJ99/social-media-api

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/MohamadJ99/Social-Media-App.git
cd Social-Media-App
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_STORAGE_URL=http://127.0.0.1:8000/storage
```

Additional environment variables may be required for real-time communication depending on the Laravel Reverb configuration.

### 4. Start the Laravel backend

Make sure the backend API is running before starting the frontend.

The backend repository contains the Laravel setup instructions.

### 5. Run the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## Production Build

To verify the application for production:

```bash
npm run build
```

Then run:

```bash
npm start
```

---

## Related Repository

### Backend API

**Laravel Social Media API**

https://github.com/MohamadJ99/social-media-api

---

## Project Status

🚧 **Ongoing Project**

Core social media functionality is implemented, including authentication, profiles, posts, friendships, notifications, real-time messaging, stories, and AI-assisted post generation.

Additional improvements, testing, optimization, and UI refinements are continuing as the project evolves.

---

## Author

**Mohammad Jawad Al-Shanableh**

Junior Full Stack Developer

- GitHub: https://github.com/MohamadJ99
- LinkedIn: https://www.linkedin.com/in/mohamad-jawad99