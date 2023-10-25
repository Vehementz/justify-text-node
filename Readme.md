# Text Justification API

The Text Justification API is a Node.js application that provides text justification services. Clients can send a piece of text to the API, which returns the text justified to fit within a specific width.

## Features

- Secure token-based authentication.
- Text justification.
- Daily word count rate limit.
- Built-in rate limiter for API requests.

## Getting Started

### Prerequisites

Ensure that you have the following installed:

- Node.js
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Vehementz/postApi.git
```

2. Navigate to the project directory:
```bash
cd cd postApi
```

3. Install dependencies:
```bash
npm install
```

4. Start the server:
```bash
node app.js
```

The API should be running and listening on port 8080.

## Usage

### Requesting a Token

# A curl request to generate a token

To make justified text requests, a token is needed. Obtain a token:

```bash
curl -X POST -H "Content-Type: application/json" --data '{"email": "your_email@domain.com"}' http://localhost:8080/api/token
```

The API will respond with a token. Use this token for subsequent requests.

### Justifying Text

Send a piece of text for justification:

```bash
curl -X POST -H "Content-Type: text/plain" -H "Authorization: Bearer YOUR_TOKEN" --data "Your text to be justified goes here." http://localhost:8080/api/justify
```

Replace `YOUR_TOKEN` with the token you received.

### Rate Limits

- Each user is rate-limited to 80,000 words per day.
- API requests are limited to 100 requests per 15 minutes.

## Security

- Uses JSON Web Tokens (JWT) for authentication.
- Implements rate limits to prevent abuse.
- Sanitizes text input to prevent malicious code execution.


