# YouTube Summary web app by Luis Hernández

This is the frontend web app of a YouTube summarization tool that utilizes OpenAI's GPT-3 language model to generate summaries of audio transcripts by providing the youtube link.

You can also check out the [server](https://github.com/luisher98/tubesummary-server).

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [API Endpoints](#api-endpoints)

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed
- npm or yarn installed

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/luisher98/tubesummary-webapp.git
   ```
2. Navigate to the project directory:
   ```
   cd tubesummary-app
   ```
3. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```
4. Start the next.js application
   ```
   npm run dev
   ```
5. Start the json-server in a new terminal window
   ```
   npx json-server -p 3500 -w ./data/data.json
   ```

## API Endpoints

The application provides the following API endpoints:

### `GET /api/info`
Fetches metadata about a YouTube video (title, thumbnail, channel, etc.).
```
/api/info?url=https://www.youtube.com/watch?v=VIDEO_ID
```

### `GET /api/video-status`
Checks if a YouTube video exists and is accessible.
```
/api/video-status?url=https://www.youtube.com/watch?v=VIDEO_ID
```

### `GET /api/youtube-summary-sse`
Generates and streams a video summary using Server-Sent Events (SSE). The summary is delivered in real-time chunks.
```
/api/youtube-summary-sse?url=https://www.youtube.com/watch?v=VIDEO_ID&wordCount=200
```

All endpoints use Edge Runtime for optimal performance and low latency. For detailed API documentation, check the JSDoc comments in the route files.
