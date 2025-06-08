from fastmcp import FastMCP
import boto3
import os
import json
from datetime import datetime
from typing import Optional, List
from dotenv import load_dotenv

load_dotenv()
mcp = FastMCP("Profile")

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
profile_table = dynamodb.Table(os.environ.get('PROFILE_TABLE_NAME', 'ProfileTable'))

@mcp.tool()
def get_profile(user_id: str) -> str:
    """Get a user's profile.
    
    Args:
        user_id: The ID of the user.
    """
    try:
        response = profile_table.get_item(Key={"id": user_id})
        profile = response.get("Item")
        
        if not profile:
            # Create a default profile if it doesn't exist
            profile = {
                "id": user_id,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat(),
                "name": None,
                "location": None,
                "job": None,
                "connections": [],
                "interests": []
            }
            
            profile_table.put_item(Item=profile)
        
        return json.dumps(profile, default=str)
    except Exception as e:
        return f"Error getting profile: {str(e)}"

@mcp.tool()
def update_profile(
    user_id: str,
    name: Optional[str] = None,
    location: Optional[str] = None,
    job: Optional[str] = None,
    connections: Optional[List[str]] = None,
    interests: Optional[List[str]] = None
) -> str:
    """Update a user's profile.
    
    Args:
        user_id: The ID of the user.
        name: The user's name.
        location: The user's location.
        job: The user's job.
        connections: Personal connections of the user, such as family members, friends, or coworkers.
        interests: Interests that the user has.
    """
    try:
        # Check if profile exists
        response = profile_table.get_item(Key={"id": user_id})
        profile = response.get("Item")
        
        if not profile:
            # Create a new profile
            profile = {
                "id": user_id,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat(),
                "name": None,
                "location": None,
                "job": None,
                "connections": [],
                "interests": []
            }
        else:
            profile["updated_at"] = datetime.utcnow().isoformat()
        
        # Update fields if provided
        if name is not None:
            profile["name"] = name
        
        if location is not None:
            profile["location"] = location
        
        if job is not None:
            profile["job"] = job
        
        if connections is not None:
            profile["connections"] = connections
        
        if interests is not None:
            profile["interests"] = interests
        
        # Save to DynamoDB
        profile_table.put_item(Item=profile)
        
        return json.dumps({
            "user_id": user_id,
            "message": "Profile updated successfully",
            "profile": profile
        }, default=str)
    except Exception as e:
        return f"Error updating profile: {str(e)}"

@mcp.tool()
def add_interest(user_id: str, interest: str) -> str:
    """Add an interest to a user's profile.
    
    Args:
        user_id: The ID of the user.
        interest: The interest to add.
    """
    try:
        if not interest:
            return "Interest cannot be empty"
        
        # Get profile
        response = profile_table.get_item(Key={"id": user_id})
        profile = response.get("Item")
        
        if not profile:
            # Create a new profile
            profile = {
                "id": user_id,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat(),
                "name": None,
                "location": None,
                "job": None,
                "connections": [],
                "interests": [interest]
            }
        else:
            # Update profile
            interests = profile.get("interests", [])
            if interest not in interests:
                interests.append(interest)
            
            profile["interests"] = interests
            profile["updated_at"] = datetime.utcnow().isoformat()
        
        # Save to DynamoDB
        profile_table.put_item(Item=profile)
        
        return json.dumps({
            "user_id": user_id,
            "message": f"Interest '{interest}' added successfully",
            "interests": profile.get("interests", [])
        }, default=str)
    except Exception as e:
        return f"Error adding interest: {str(e)}"

@mcp.tool()
def add_connection(user_id: str, connection: str) -> str:
    """Add a connection to a user's profile.
    
    Args:
        user_id: The ID of the user.
        connection: The connection to add.
    """
    try:
        if not connection:
            return "Connection cannot be empty"
        
        # Get profile
        response = profile_table.get_item(Key={"id": user_id})
        profile = response.get("Item")
        
        if not profile:
            # Create a new profile
            profile = {
                "id": user_id,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat(),
                "name": None,
                "location": None,
                "job": None,
                "connections": [connection],
                "interests": []
            }
        else:
            # Update profile
            connections = profile.get("connections", [])
            if connection not in connections:
                connections.append(connection)
            
            profile["connections"] = connections
            profile["updated_at"] = datetime.utcnow().isoformat()
        
        # Save to DynamoDB
        profile_table.put_item(Item=profile)
        
        return json.dumps({
            "user_id": user_id,
            "message": f"Connection '{connection}' added successfully",
            "connections": profile.get("connections", [])
        }, default=str)
    except Exception as e:
        return f"Error adding connection: {str(e)}"

@mcp.tool()
def remove_interest(user_id: str, interest: str) -> str:
    """Remove an interest from a user's profile.
    
    Args:
        user_id: The ID of the user.
        interest: The interest to remove.
    """
    try:
        if not interest:
            return "Interest cannot be empty"
        
        # Get profile
        response = profile_table.get_item(Key={"id": user_id})
        profile = response.get("Item")
        
        if not profile:
            return f"Profile not found for user: {user_id}"
        
        # Update profile
        interests = profile.get("interests", [])
        if interest in interests:
            interests.remove(interest)
            profile["interests"] = interests
            profile["updated_at"] = datetime.utcnow().isoformat()
            
            # Save to DynamoDB
            profile_table.put_item(Item=profile)
            
            return json.dumps({
                "user_id": user_id,
                "message": f"Interest '{interest}' removed successfully",
                "interests": profile.get("interests", [])
            }, default=str)
        else:
            return f"Interest '{interest}' not found in user's profile"
    except Exception as e:
        return f"Error removing interest: {str(e)}"

@mcp.tool()
def remove_connection(user_id: str, connection: str) -> str:
    """Remove a connection from a user's profile.
    
    Args:
        user_id: The ID of the user.
        connection: The connection to remove.
    """
    try:
        if not connection:
            return "Connection cannot be empty"
        
        # Get profile
        response = profile_table.get_item(Key={"id": user_id})
        profile = response.get("Item")
        
        if not profile:
            return f"Profile not found for user: {user_id}"
        
        # Update profile
        connections = profile.get("connections", [])
        if connection in connections:
            connections.remove(connection)
            profile["connections"] = connections
            profile["updated_at"] = datetime.utcnow().isoformat()
            
            # Save to DynamoDB
            profile_table.put_item(Item=profile)
            
            return json.dumps({
                "user_id": user_id,
                "message": f"Connection '{connection}' removed successfully",
                "connections": profile.get("connections", [])
            }, default=str)
        else:
            return f"Connection '{connection}' not found in user's profile"
    except Exception as e:
        return f"Error removing connection: {str(e)}"

@mcp.tool()
def list_profiles(limit: Optional[int] = 50) -> str:
    """List all profiles.
    
    Args:
        limit: Maximum number of profiles to return.
    """
    try:
        response = profile_table.scan(Limit=limit)
        profiles = response.get("Items", [])
        return json.dumps({"profiles": profiles, "count": len(profiles)}, default=str)
    except Exception as e:
        return f"Error listing profiles: {str(e)}"

@mcp.tool()
def delete_profile(user_id: str) -> str:
    """Delete a user's profile.
    
    Args:
        user_id: The ID of the user whose profile to delete.
    """
    try:
        profile_table.delete_item(Key={"id": user_id})
        return f"Profile deleted successfully for user: {user_id}"
    except Exception as e:
        return f"Error deleting profile: {str(e)}"

mcp.run(transport="streamable-http", host="127.0.0.1", port=8002)