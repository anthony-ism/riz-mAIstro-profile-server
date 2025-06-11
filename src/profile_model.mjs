import dynamoDb from './db_client.mjs';
import { config } from './config.mjs';

const tableName = config.aws.profileTableName;

export class ProfileModel {
  static createDefaultProfile(userId) {
    console.log("attempting to create default profile")
    const now = new Date().toISOString();
    return {
      id: userId,
      created_at: now,
      updated_at: now,
      name: null,
      location: null,
      job: null,
      connections: [],
      interests: []
    };
  }

  static async getProfile(userId) {
    console.log("attempting to get profile")
    try {
      const params = {
        TableName: tableName,
        Key: { id: userId }
      };

      const result = await dynamoDb.get(params).promise();
      
      if (!result.Item) {
        // Create default profile if it doesn't exist
        const defaultProfile = this.createDefaultProfile(userId);
        await this.saveProfile(defaultProfile);
        return defaultProfile;
      }

      return result.Item;
    } catch (error) {
      throw new Error(`Error getting profile: ${error.message}`);
    }
  }

  static async saveProfile(profile) {
    console.log("attempting to save profile")
    try {
      const params = {
        TableName: tableName,
        Item: profile
      };

      await dynamoDb.put(params).promise();
      return profile;
    } catch (error) {
      throw new Error(`Error saving profile: ${error.message}`);
    }
  }

  static async updateProfile(userId, updates) {
    console.log("attempting to update profile")
    try {
      // Get existing profile
      const profile = await this.getProfile(userId);
      
      // Update fields if provided
      if (updates.name !== undefined) profile.name = updates.name;
      if (updates.location !== undefined) profile.location = updates.location;
      if (updates.job !== undefined) profile.job = updates.job;
      if (updates.connections !== undefined) profile.connections = updates.connections;
      if (updates.interests !== undefined) profile.interests = updates.interests;
      
      // Update timestamp
      profile.updated_at = new Date().toISOString();
      
      // Save updated profile
      return await this.saveProfile(profile);
    } catch (error) {
      throw new Error(`Error updating profile: ${error.message}`);
    }
  }

  static async addInterest(userId, interest) {
    console.log("attempting to add interest")
    try {
      if (!interest) {
        throw new Error('Interest cannot be empty');
      }

      const profile = await this.getProfile(userId);
      
      if (!profile.interests.includes(interest)) {
        profile.interests.push(interest);
        profile.updated_at = new Date().toISOString();
        await this.saveProfile(profile);
      }

      return profile;
    } catch (error) {
      throw new Error(`Error adding interest: ${error.message}`);
    }
  }

  static async removeInterest(userId, interest) {
    console.log("attempting to remove interest")
    try {
      if (!interest) {
        throw new Error('Interest cannot be empty');
      }

      const profile = await this.getProfile(userId);
      
      const index = profile.interests.indexOf(interest);
      if (index === -1) {
        throw new Error(`Interest '${interest}' not found in user's profile`);
      }

      profile.interests.splice(index, 1);
      profile.updated_at = new Date().toISOString();
      await this.saveProfile(profile);

      return profile;
    } catch (error) {
      throw new Error(`Error removing interest: ${error.message}`);
    }
  }

  static async addConnection(userId, connection) {
    console.log("attempting to add connection")
    try {
      if (!connection) {
        throw new Error('Connection cannot be empty');
      }

      const profile = await this.getProfile(userId);
      
      if (!profile.connections.includes(connection)) {
        profile.connections.push(connection);
        profile.updated_at = new Date().toISOString();
        await this.saveProfile(profile);
      }

      return profile;
    } catch (error) {
      throw new Error(`Error adding connection: ${error.message}`);
    }
  }

  static async removeConnection(userId, connection) {
    console.log("attempting to remove connection")
    try {
      if (!connection) {
        throw new Error('Connection cannot be empty');
      }

      const profile = await this.getProfile(userId);
      
      const index = profile.connections.indexOf(connection);
      if (index === -1) {
        throw new Error(`Connection '${connection}' not found in user's profile`);
      }

      profile.connections.splice(index, 1);
      profile.updated_at = new Date().toISOString();
      await this.saveProfile(profile);

      return profile;
    } catch (error) {
      throw new Error(`Error removing connection: ${error.message}`);
    }
  }

  static async listProfiles(limit = 50) {
    console.log("attempting to list profile")
    try {
      const params = {
        TableName: tableName,
        Limit: limit
      };

      const result = await dynamoDb.scan(params).promise();
      
      return {
        profiles: result.Items || [],
        count: result.Items ? result.Items.length : 0
      };
    } catch (error) {
      throw new Error(`Error listing profiles: ${error.message}`);
    }
  }

  static async deleteProfile(userId) {
    console.log("attempting to delete profile")
    try {
      const params = {
        TableName: tableName,
        Key: { id: userId }
      };

      await dynamoDb.delete(params).promise();
      return { message: `Profile deleted successfully for user: ${userId}` };
    } catch (error) {
      throw new Error(`Error deleting profile: ${error.message}`);
    }
  }
}