# TubeSummary web app by Luis Hernández

This is the frontend web app of a YouTube summarization tool that utilizes OpenAI's GPT-3 language model to generate summaries of audio transcripts by providing the youtube link.

You can also check out the [server](https://github.com/luisher98/tubesummary-server).

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed
- npm or yarn installed

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/luisher98/tubesummary-webapp.git
2. Navigate to the project directory:
   ```
   cd tubesummary-app
3. Install dependencies
   ```
   npm install
   # or
   yarn install
4. Start the next.js application
    ```
   npm run dev
5. Start the json-server in a new terminal window
   ```
   npx json-server -p 3500 -w ./src/data/data.json
