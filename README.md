# Profile MCP Server

A Model Context Protocol (MCP) server for managing user profiles using AWS Lambda and DynamoDB.

## Project Structure

```
profile-mcp-server/
├── dev/
│   └── local_server.mjs            # Local server for testing
├── src/
│   └── config.mjs                  # Configuration management
│   └── db_client.mjs               # DynamoDB client setup
│   └── lambda.js                   # Main Lambda handler
│   └── profile_model.mjs           # Profile data model and database operations
│   └── profile_tools.js            # MCP tool definitions
│   └── server.mjs                  # MCP server initialization
├── package.json                    # Dependencies and scripts
├── .env.example                    # Environment variables example
└── README.md                       # This file
```

## Features

The server provides the following MCP tools:

- **get_profile** - Retrieve a user's profile
- **update_profile** - Update user profile information
- **add_interest** - Add an interest to a user's profile
- **remove_interest** - Remove an interest from a user's profile
- **add_connection** - Add a connection to a user's profile
- **remove_connection** - Remove a connection from a user's profile
- **list_profiles** - List all profiles (with optional limit)
- **delete_profile** - Delete a user's profile

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your AWS configuration
   ```

3. **Set up DynamoDB table:**
   See profile-server-cdk project

## Usage

### Local Development

```bash
npm run dev
```

### AWS Lambda Deployment

The server is designed to run as an AWS Lambda function. See profile-server-cdk project.

## Profile Schema

Each profile contains:

```json
{
  "id": "string",
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp",
  "name": "string | null",
  "location": "string | null", 
  "job": "string | null",
  "connections": ["array", "of", "strings"],
  "interests": ["array", "of", "strings"]
}
```

## Testing and troubleshooting
```bash
   npx @modelcontextprotocol/inspector
```

