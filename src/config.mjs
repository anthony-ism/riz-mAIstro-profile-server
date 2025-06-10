import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    profileTableName: process.env.PROFILE_TABLE_NAME || 'ProfileTable',
  },
  server: {
    name: 'Profile MCP Server',
    version: '1.0.0',
  }
};