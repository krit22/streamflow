# Streamflow API Documentation

This document describes all API endpoints exposed by the Streamflow API backend.

## Base URL
All API requests should be made to:
```
http://localhost:8000/api/v1
```

## Authentication

Authentication is handled via JWT (JSON Web Tokens). Endpoints requiring authentication expect the token in the `Authorization` header as a Bearer token:

```http
Authorization: Bearer <your_jwt_token>
```

If the token is missing, expired, or invalid, the request will fail with a `401 Unauthorized` or `403 Forbidden` response.

---

## Route Summary

| Endpoint | Method | Auth Required | Description |
|---|---|---|---|
| `/health` | GET | No | Health check endpoint |
| `/users/register` | POST | No | Registers a new user account |
| `/users/login` | POST | No | Authenticates a user and returns a JWT |
| `/channels/createchannel` | POST | Yes | Creates a new channel for the logged-in user |
| `/channels/getChannelProfile/:id` | GET | No | Retrieves channel profile information including videos |
| `/videos/initialize` | POST | Yes | Initializes a video upload and gets a signed Supabase URL |
| `/videos/:videoId/finalize` | POST | Yes | Finalizes video upload, updating status to `UPLOADED` |
| `/videos/:videoId` | GET | No | Retrieves detailed metadata for a single video |
| `/videos` | GET | No | Fetches a paginated list of uploaded videos |

---

## Endpoints Detailed Spec

### Health Check

#### `GET /health`
*Note: This route is served from the root path `/health`, not `/api/v1/health`.*

- **Description**: Verifies if the API server is running.
- **Authorization**: None.
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "ok"
    }
    ```

---

### Users & Auth (`/users`)

#### `POST /users/register`
- **Description**: Registers a new user.
- **Authorization**: None.
- **Request Body (JSON)**:
  - `email` (string, required): Valid email address.
  - `password` (string, required): Minimum 8 characters.
  - `name` (string, required): Minimum 2 characters.
- **Responses**:
  - **200 OK** (Registration Successful):
    ```json
    {
      "success": true,
      "data": {
        "user": {
          "id": "5069fa5c-347a-4d3a-b985-145c039b66d9",
          "email": "creator@example.com",
          "name": "Jane Doe"
        }
      }
    }
    ```
  - **400 Bad Request** (Validation Error):
    ```json
    {
      "success": false,
      "error": {
        "code": "VALIDATION_ERROR",
        "message": "Validation failed...",
        "issues": [
          {
            "code": "too_small",
            "minimum": 8,
            "type": "string",
            "inclusive": true,
            "exact": false,
            "message": "Password must be at least 8 characters",
            "path": ["password"]
          }
        ]
      }
    }
    ```
  - **409 Conflict** (Email Already Exists):
    ```json
    {
      "success": false,
      "error": {
        "code": "EMAIL_ALREADY_EXISTS",
        "message": "User with this email already exists"
      }
    }
    ```

#### `POST /users/login`
- **Description**: Logs in a user and returns a JWT access token.
- **Authorization**: None.
- **Request Body (JSON)**:
  - `email` (string, required): Valid email address.
  - `password` (string, required): Minimum 8 characters.
- **Responses**:
  - **200 OK** (Login Successful):
    ```json
    {
      "success": true,
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
    ```
  - **400 Bad Request** (Validation Error):
    ```json
    {
      "success": false,
      "error": {
        "code": "VALIDATION_ERROR",
        "message": "...",
        "issues": []
      }
    }
    ```
  - **401 Unauthorized** (Invalid Credentials / Password / User Not Found):
    ```json
    {
      "success": false,
      "error": {
        "code": "INVALID_PASSWORD", // or "USER NOT FOUND" or "INVALID_CREDENTIALS"
        "message": "Invalid email or password"
      }
    }
    ```

---

### Channels (`/channels`)

#### `POST /channels/createchannel`
- **Description**: Creates a new video channel for the authenticated user.
- **Authorization**: Required (`Bearer <token>`).
- **Request Body (JSON)**:
  - `name` (string, required): The name of the channel.
  - `description` (string, required): A description of the channel.
- **Responses**:
  - **201 Created**:
    ```json
    {
      "success": true,
      "data": {
        "id": "c9cece4e-eb85-44c8-9a27-a5755cc29b63",
        "name": "Dev Journey",
        "description": "Coding and building startups.",
        "userId": "5069fa5c-347a-4d3a-b985-145c039b66d9"
      }
    }
    ```
  - **400 Bad Request** (Validation Error):
    ```json
    {
      "success": false,
      "error": {
        "code": "VALIDATION_ERROR",
        "message": "...",
        "issues": []
      }
    }
    ```
  - **401 Unauthorized** (No token / Invalid token):
    *Handled by authmiddleware*

#### `GET /channels/getChannelProfile/:id`
- **Description**: Retrieves a channel's profile data, including its list of uploaded videos.
- **Authorization**: None.
- **Route Parameters**:
  - `id` (string, required): The UUID of the channel.
- **Responses**:
  - **200 OK**:
    ```json
    {
      "success": true,
      "data": {
        "id": "c9cece4e-eb85-44c8-9a27-a5755cc29b63",
        "name": "Dev Journey",
        "description": "Coding and building startups.",
        "subscriberCount": 0,
        "videos": [
          {
            "id": "a4109531-1d6b-4c72-ae1d-00058bff973d",
            "title": "js course end to end4",
            "description": "Full js course",
            "thumbnailUrl": null,
            "videoUrl": "https://...",
            "likeCount": 0,
            "viewsCount": 0,
            "status": "UPLOADED",
            "type": "PUBLIC",
            "createdAt": "2026-05-30T15:40:18.915Z",
            "channelId": "c9cece4e-eb85-44c8-9a27-a5755cc29b63"
          }
        ]
      }
    }
    ```
  - **500 Internal Server Error** (Channel Not Found / Invalid UUID):
    ```json
    {
      "success": false,
      "error": {
        "code": "INTERNAL_SERVER_ERROR",
        "message": "Internal server error",
        "issues": ["Error: Channel not found"]
      }
    }
    ```

---

### Videos (`/videos`)

#### `POST /videos/initialize`
- **Description**: Registers a video upload intent in the database with state `PENDING` and returns a presigned Supabase upload URL for the frontend.
- **Authorization**: Required (`Bearer <token>`).
- **Request Body (JSON)**:
  - `channelId` (string, required): UUID of the channel. The logged-in user must own this channel.
  - `title` (string, required): Video title (3 to 100 characters).
  - `description` (string, optional): Video description (3 to 1000 characters).
  - `contentType` (string, required): File mime type. Must be exactly `"video/mp4"`.
- **Responses**:
  - **200 OK**:
    ```json
    {
      "success": true,
      "data": {
        "videoId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d2ba3",
        "uploadUrl": "https://twguafnjywylqaeichdq.supabase.co/storage/v1/object/upload/sign/videos/1234567890.mp4?token=...",
        "videoUrl": "https://twguafnjywylqaeichdq.supabase.co/storage/v1/object/public/videos/1234567890.mp4"
      }
    }
    ```
  - **400 Bad Request** (Validation Error or Unsupported File Type):
    ```json
    {
      "success": false,
      "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid request body" // or "Invalid content type. Only video/mp4... are supported."
      }
    }
    ```
  - **403 Forbidden** (Channel does not exist or user does not own it):
    ```json
    {
      "success": false,
      "error": {
        "code": "PERMISSION_DENIED",
        "message": "You do not have permission to upload videos to this channel."
      }
    }
    ```

#### `POST /videos/:videoId/finalize`
- **Description**: Marks the video status as `UPLOADED` once the client finishes uploading the file directly to storage.
- **Authorization**: Required (`Bearer <token>`).
- **Route Parameters**:
  - `videoId` (string, required): UUID of the video.
- **Responses**:
  - **200 OK**:
    ```json
    {
      "success": true,
      "message": "Video finalized successfully"
    }
    ```
  - **403 Forbidden** (User doesn't own the video channel):
    ```json
    {
      "success": false,
      "error": {
        "code": "PERMISSION_DENIED",
        "message": "You do not have permission to access this video"
      }
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "success": false,
      "error": {
        "code": "NOT_FOUND",
        "message": "Video not found"
      }
    }
    ```

#### `GET /videos/:videoId`
- **Description**: Retrieves video metadata.
- **Authorization**: None.
- **Route Parameters**:
  - `videoId` (string, required): UUID of the video.
- **Responses**:
  - **200 OK**:
    ```json
    {
      "success": true,
      "data": {
        "id": "a4109531-1d6b-4c72-ae1d-00058bff973d",
        "title": "js course end to end4",
        "description": "Full js course",
        "thumbnailUrl": null,
        "videoUrl": "https://...",
        "likeCount": 0,
        "viewsCount": 0,
        "status": "UPLOADED",
        "type": "PUBLIC",
        "createdAt": "2026-05-30T15:40:18.915Z",
        "channelId": "c9cece4e-eb85-44c8-9a27-a5755cc29b63",
        "channel": {
          "id": "c9cece4e-eb85-44c8-9a27-a5755cc29b63",
          "name": "Dev Journey",
          "description": "Coding and building startups.",
          "bannerUrl": null,
          "subscriberCount": 0,
          "createdAt": "2026-05-30T09:56:08.323Z",
          "userId": "5069fa5c-347a-4d3a-b985-145c039b66d9"
        }
      }
    }
    ```
  - **403 Forbidden** (Video exists but status is not `UPLOADED` yet):
    ```json
    {
      "success": false,
      "error": {
        "code": "VIDEO_UNAVAILABLE",
        "message": "Video is not available"
      }
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "success": false,
      "error": {
        "code": "NOT_FOUND",
        "message": "Video not found"
      }
    }
    ```

#### `GET /videos`
- **Description**: Returns a paginated list of uploaded videos, sorted by creation date (cursor-based pagination).
- **Authorization**: None.
- **Query Parameters**:
  - `limit` (number, optional): Maximum records to fetch. Default is `10`.
  - `cursor` (string, optional): Video UUID to use as pagination cursor.
- **Responses**:
  - **200 OK**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "a4109531-1d6b-4c72-ae1d-00058bff973d",
          "title": "js course end to end4",
          "description": "Full js course",
          "thumbnailUrl": null,
          "videoUrl": "https://...",
          "likeCount": 0,
          "viewsCount": 0,
          "status": "UPLOADED",
          "type": "PUBLIC",
          "createdAt": "2026-05-30T15:40:18.915Z",
          "channelId": "c9cece4e-eb85-44c8-9a27-a5755cc29b63",
          "channel": {
            "id": "c9cece4e-eb85-44c8-9a27-a5755cc29b63",
            "name": "Dev Journey",
            "description": "Coding and building startups.",
            "bannerUrl": null,
            "subscriberCount": 0,
            "createdAt": "2026-05-30T09:56:08.323Z",
            "userId": "5069fa5c-347a-4d3a-b985-145c039b66d9"
          }
        }
      ]
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "success": false,
      "error": {
        "code": "NOT_FOUND",
        "message": "Videos not found"
      }
    }
    ```
