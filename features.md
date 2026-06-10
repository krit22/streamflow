# Streamflow — Remaining Features List

This document lists the features and pages that are currently supported (or mostly supported) by the backend but are yet to be fully implemented in the frontend.

## 1. Core Pages

### History Page
- **Backend Status:** Ready (`GET /api/v1/users/me/history`)
- **Description:** A page where users can view their playback history in reverse chronological order.
- **Tasks:**
  - Implement `/history` route.
  - Create a video list component for history (with "Viewed at" timestamps).
  - Add "Clear History" functionality (backend endpoint may need to be added).

### Liked Videos Page
- **Backend Status:** Partial (Likes tracked in DB; `GET /api/v1/users/me/likes` endpoint needed)
- **Description:** A dedicated page for users to revisit videos they have liked.
- **Tasks:**
  - Implement `/liked-videos` route.
  - Fetch and display the list of liked videos.

### "Your Videos" / Creator Dashboard
- **Backend Status:** Ready (Channel fetch returns videos; Update/Delete endpoints exist)
- **Description:** A management area for users to see their own uploads.
- **Tasks:**
  - Create a dashboard to list all uploaded videos.
  - Add buttons for "Edit Video" and "Delete Video".
  - Implement the Edit Video modal/page (title, description, visibility).

---

## 2. Functionality & Management

### Video Upload System
- **Backend Status:** Ready (`/initialize` and `/:videoId/finalize`)
- **Description:** Full end-to-end video uploading.
- **Tasks:**
  - Create an Upload button/modal.
  - Implement file selection for video (.mp4) and thumbnail (.png/jpg).
  - Handle S3/Supabase Storage upload using signed URLs.
  - Call finalize endpoint after successful upload.

### Channel Management
- **Backend Status:** Ready (`POST /api/v1/channels/createchannel`)
- **Description:** Creating and editing user channels.
- **Tasks:**
  - Implement "Create Channel" UI for users without one.
  - Add "Edit Channel Profile" (name, description, banner/avatar).

### Subscription Management Page
- **Backend Status:** Ready (`GET /api/v1/users/me/subscriptions`)
- **Description:** A centralized place to manage all subscribed channels.
- **Tasks:**
  - Create `/subscriptions/manage` or similar.
  - List all subscribed channels with a prominent "Unsubscribe" button.

### User Settings
- **Backend Status:** Ready (`GET /api/v1/users/me`)
- **Description:** Updating personal user information.
- **Tasks:**
  - Create `/settings` or `/profile/edit`.
  - Allow updating name and profile picture URL.

---

## 3. UI/UX Enhancements

### Search Results Page
- **Backend Status:** Ready for implementation (Base video listing exists)
- **Description:** Finding videos by title or description.
- **Tasks:**
  - Implement search bar logic in the Header.
  - Create `/search?q=...` page.

### Comment Management
- **Backend Status:** Ready (`DELETE /api/v1/videos/:videoId/comments/:commentId`)
- **Description:** Allowing users to manage their interaction.
- **Tasks:**
  - Add "Delete" button to comments owned by the current user.

### Polishing
- **Tasks:**
  - Add Loading Skeletons for all video grids.
  - Implement Empty States ("No history yet", "No liked videos", etc.).
  - Add Toast notifications for actions like "Video Liked", "Subscribed", "Upload Started".
