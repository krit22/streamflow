# Streamflow API — Reference

**Base URL:** `http://localhost:8000`  
**API prefix:** `/api/v1`  
**Auth (protected routes):** `Authorization: Bearer <jwt>`

All JSON responses: `{ success, data?, error?: { code, message, issues?|details? } }`

---

## Health

### `GET /health`
- **Auth:** No
- **200:** `{ status: "ok" }`

---

## Users — `/api/v1/users`

### `POST /register`
- **Body:** `{ email, password (min 8), name (min 2) }`
- **200:** `{ success: true, data: { user: { id, email, name } } }`
- **400:** `VALIDATION_ERROR`
- **409:** `EMAIL_ALREADY_EXISTS`

### `POST /login`
- **Body:** `{ email, password (min 8) }`
- **200:** `{ success: true, data: { token } }` (JWT, 1h)
- **400:** `VALIDATION_ERROR`
- **401:** `USER NOT FOUND` | `INVALID_PASSWORD` | `INVALID_CREDENTIALS`

### `GET /me` — Auth required
- **200:** `{ success: true, data: { id, email, name, profileUrl, createdAt, channels: [...] } }`
- **401:** `UNAUTHORIZED` | **404:** `NOT_FOUND` | **500:** `INTERNAL_ERROR`

### `GET /me/subscriptions` — Auth required
- **200:** `{ success: true, data: [channel objects] }`
- **401:** `UNAUTHORIZED` | **500:** `INTERNAL_ERROR`

---

## Channels — `/api/v1/channels`

### `POST /createchannel` — Auth required
- **Body:** `{ name, description }`
- **201:** `{ success: true, data: { id, name, description, userId } }`
- **400:** `VALIDATION_ERROR` | **401:** `UNAUTHORIZED`

### `GET /getChannelProfile/:id`
- **200:** `{ success: true, data: { id, name, description, subscriberCount, videos } }`
- **500:** `INTERNAL_SERVER_ERROR` (incl. missing channel)

### `GET /:channelId/subscribe` — Auth required
- **200:** `{ success: true, data: { isSubscribed } }`
- **401:** `UNAUTHORIZED` | **500:** `INTERNAL_ERROR`

### `POST /:channelId/subscribe` — Auth required
- **201:** `{ success: true, message: "Subscribed successfully" }`
- **400:** `BAD_REQUEST` (own channel) | **401:** `UNAUTHORIZED` | **409:** `ALREADY_SUBSCRIBED` | **500:** `INTERNAL_ERROR`

### `DELETE /:channelId/subscribe` — Auth required
- **200:** `{ success: true, message: "Unsubscribed successfully" }`
- **401:** `UNAUTHORIZED` | **409:** `NOT_SUBSCRIBED` | **500:** `INTERNAL_ERROR`

---

## Videos — `/api/v1/videos`

### `POST /initialize` — Auth required
- **Body:** `{ channelId (uuid), title (3–100), description? (3–1000), contentType: "video/mp4" }`
- **200:** `{ success: true, data: { videoId, uploadUrl, videoUrl } }`
- **400:** `VALIDATION_ERROR` | **401:** `UNAUTHORIZED` | **403:** `PERMISSION_DENIED` | **500:** `INTERNAL_ERROR`

### `POST /:videoId/finalize` — Auth required
- **200:** `{ success: true, message: "Video finalized successfully" }`
- **401:** `UNAUTHORIZED` | **403:** `PERMISSION_DENIED` | **404:** `NOT_FOUND` | **500:** `INTERNAL_ERROR`

### `GET /`
- **Query:** `limit?` (default 10), `cursor?` (video id from previous `nextCursor`)
- **200:** `{ success: true, data: { videos: Video[], nextCursor: string | null } }` — UPLOADED only, each video includes `channel`. `nextCursor` is the id of the last video in the page when more results exist; `null` at end of feed.
- **500:** `INTERNAL_ERROR`

**Pagination:** First request omit `cursor`. Pass `?cursor=<nextCursor>` on subsequent requests until `nextCursor` is `null`.

### `GET /:videoId`
- **200:** `{ success: true, data: Video & { channel } }`
- **403:** `VIDEO_UNAVAILABLE` | **404:** `NOT_FOUND` | **500:** `INTERNAL_ERROR`

### `PATCH /:videoId` — Auth required
- **Body:** `{ title?, description?, type?: "PUBLIC" | "PRIVATE" | "LINK_ONLY" }`
- **200:** `{ success: true, data: updated Video }`
- **400:** `VALIDATION_ERROR` | **401:** `UNAUTHORIZED` | **403:** `PERMISSION_DENIED` | **404:** `NOT_FOUND` | **500:** `INTERNAL_ERROR`

### `DELETE /:videoId` — Auth required
- **200:** `{ success: true, message: "Video deleted successfully" }`
- **401:** `UNAUTHORIZED` | **403:** `PERMISSION_DENIED` | **404:** `NOT_FOUND` | **500:** `INTERNAL_ERROR`

### `POST /:videoId/view`
- **200:** `{ success: true, message: "View count updated" }`
- **403:** `VIDEO_UNAVAILABLE` | **404:** `NOT_FOUND` | **500:** `INTERNAL_ERROR`

---

## Likes — `/api/v1/videos/:videoId/like`

### `GET /:videoId/like` — Auth required
- **200:** `{ success: true, data: { isLiked } }`
- **401:** `UNAUTHORIZED` | **404:** `NOT_FOUND` | **500:** `INTERNAL_ERROR`

### `POST /:videoId/like` — Auth required
- **201:** `{ success: true, message: "Video liked successfully" }`
- **401:** `UNAUTHORIZED` | **404:** `NOT_FOUND` | **409:** `ALREADY_LIKED` | **500:** `INTERNAL_ERROR`

### `DELETE /:videoId/like` — Auth required
- **200:** `{ success: true, message: "Video unliked successfully" }`
- **401:** `UNAUTHORIZED` | **404:** `NOT_FOUND` | **409:** `NOT_LIKED` | **500:** `INTERNAL_ERROR`

---

## Comments — `/api/v1/videos/:videoId/comments`

### `POST /:videoId/comments` — Auth required
- **Body:** `{ commentBody (1–1000) }`
- **201:** `{ success: true, data: Comment & { user: { id, name, profileUrl } } }`
- **400:** `VALIDATION_ERROR` | **401:** `UNAUTHORIZED` | **404:** `NOT_FOUND` | **500:** `INTERNAL_ERROR`

### `GET /:videoId/comments`
- **Query:** `limit?` (default 20), `cursor?`
- **200:** `{ success: true, data: Comment[] }` (each with user)
- **404:** `NOT_FOUND` | **500:** `INTERNAL_ERROR`

### `DELETE /:videoId/comments/:commentId` — Auth required
- **200:** `{ success: true, message: "Comment deleted successfully" }`
- **400:** `BAD_REQUEST` | **401:** `UNAUTHORIZED` | **403:** `PERMISSION_DENIED` | **404:** `NOT_FOUND` | **500:** `INTERNAL_ERROR`

---

## Model shapes

**Video:** `id`, `title`, `description`, `thumbnailUrl`, `videoUrl`, `likeCount`, `viewsCount`, `status`, `type`, `createdAt`, `channelId` (+ `channel` when included)

**Comment:** `id`, `commentBody`, `createdAt`, `videoId`, `userId` (+ `user` when included)

**Auth failure (protected routes):** **401** `{ success: false, error: { code: "UNAUTHORIZED", message: "Token not found or invalid" } }`
