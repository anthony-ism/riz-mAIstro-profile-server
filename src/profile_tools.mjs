import { z } from 'zod';
import { ProfileModel } from './profile_model.mjs';

export const profileTools = {
  // Get profile tool
  getProfile: {
    name: 'get_profile',
    description: 'Get a user\'s profile',
    inputSchema: {
      user_id: z.string().describe('The ID of the user')
    },
    handler: async ({ user_id }) => {
      try {
        console.log(user_id);
        const profile = await ProfileModel.getProfile(user_id);
        
        return {
          content: [{ 
            type: 'text', 
            text: JSON.stringify(profile, null, 2) 
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: 'text', 
            text: error.message 
          }]
        };
      }
    }
  },

  // Update profile tool
  updateProfile: {
    name: 'update_profile',
    description: 'Update a user\'s profile',
    inputSchema: {
      user_id: z.string().describe('The ID of the user'),
      name: z.string().optional().describe('The user\'s name'),
      location: z.string().optional().describe('The user\'s location'),
      job: z.string().optional().describe('The user\'s job'),
      connections: z.array(z.string()).optional().describe('Personal connections of the user, such as family members, friends, or coworkers'),
      interests: z.array(z.string()).optional().describe('Interests that the user has')
    },
    handler: async ({ user_id, name, location, job, connections, interests }) => {
      try {
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (location !== undefined) updates.location = location;
        if (job !== undefined) updates.job = job;
        if (connections !== undefined) updates.connections = connections;
        if (interests !== undefined) updates.interests = interests;

        const profile = await ProfileModel.updateProfile(user_id, updates);
        
        return {
          content: [{ 
            type: 'text', 
            text: JSON.stringify({
              user_id,
              message: 'Profile updated successfully',
              profile
            }, null, 2) 
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: 'text', 
            text: error.message 
          }]
        };
      }
    }
  },

  // Add interest tool
  addInterest: {
    name: 'add_interest',
    description: 'Add an interest to a user\'s profile',
    inputSchema: {
      user_id: z.string().describe('The ID of the user'),
      interest: z.string().describe('The interest to add')
    },
    handler: async ({ user_id, interest }) => {
      try {
        const profile = await ProfileModel.addInterest(user_id, interest);
        
        return {
          content: [{ 
            type: 'text', 
            text: JSON.stringify({
              user_id,
              message: `Interest '${interest}' added successfully`,
              interests: profile.interests
            }, null, 2) 
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: 'text', 
            text: error.message 
          }]
        };
      }
    }
  },

  // Remove interest tool
  removeInterest: {
    name: 'remove_interest',
    description: 'Remove an interest from a user\'s profile',
    inputSchema: {
      user_id: z.string().describe('The ID of the user'),
      interest: z.string().describe('The interest to remove')
    },
    handler: async ({ user_id, interest }) => {
      try {
        const profile = await ProfileModel.removeInterest(user_id, interest);
        
        return {
          content: [{ 
            type: 'text', 
            text: JSON.stringify({
              user_id,
              message: `Interest '${interest}' removed successfully`,
              interests: profile.interests
            }, null, 2) 
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: 'text', 
            text: error.message 
          }]
        };
      }
    }
  },

  // Add connection tool
  addConnection: {
    name: 'add_connection',
    description: 'Add a connection to a user\'s profile',
    inputSchema: {
      user_id: z.string().describe('The ID of the user'),
      connection: z.string().describe('The connection to add')
    },
    handler: async ({ user_id, connection }) => {
      try {
        const profile = await ProfileModel.addConnection(user_id, connection);
        
        return {
          content: [{ 
            type: 'text', 
            text: JSON.stringify({
              user_id,
              message: `Connection '${connection}' added successfully`,
              connections: profile.connections
            }, null, 2) 
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: 'text', 
            text: error.message 
          }]
        };
      }
    }
  },

  // Remove connection tool
  removeConnection: {
    name: 'remove_connection',
    description: 'Remove a connection from a user\'s profile',
    inputSchema: {
      user_id: z.string().describe('The ID of the user'),
      connection: z.string().describe('The connection to remove')
    },
    handler: async ({ user_id, connection }) => {
      try {
        const profile = await ProfileModel.removeConnection(user_id, connection);
        
        return {
          content: [{ 
            type: 'text', 
            text: JSON.stringify({
              user_id,
              message: `Connection '${connection}' removed successfully`,
              connections: profile.connections
            }, null, 2) 
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: 'text', 
            text: error.message 
          }]
        };
      }
    }
  },

  // List profiles tool
  listProfiles: {
    name: 'list_profiles',
    description: 'List all profiles',
    inputSchema: {
      limit: z.number().optional().default(50).describe('Maximum number of profiles to return')
    },
    handler: async ({ limit }) => {
      try {
        const result = await ProfileModel.listProfiles(limit);
        
        return {
          content: [{ 
            type: 'text', 
            text: JSON.stringify(result, null, 2) 
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: 'text', 
            text: error.message 
          }]
        };
      }
    }
  },

  // Delete profile tool
  deleteProfile: {
    name: 'delete_profile',
    description: 'Delete a user\'s profile',
    inputSchema: {
      user_id: z.string().describe('The ID of the user whose profile to delete')
    },
    handler: async ({ user_id }) => {
      try {
        const result = await ProfileModel.deleteProfile(user_id);
        
        return {
          content: [{ 
            type: 'text', 
            text: result.message 
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: 'text', 
            text: error.message 
          }]
        };
      }
    }
  }
};