"""
Shared API models between client and server
Python equivalent of the TypeScript shared types
"""

from pydantic import BaseModel
from typing import Optional, List

class DemoResponse(BaseModel):
    """Response model for /api/demo endpoint"""
    message: str

class PingResponse(BaseModel):
    """Response model for /api/ping endpoint"""
    message: str

class HealthResponse(BaseModel):
    """Response model for /api/health endpoint"""
    status: str
    service: str

# Travel planning related models for MinutePlanner
class Place(BaseModel):
    """Model for a travel destination/place"""
    id: str
    name: str
    category: str
    rating: float
    duration: str
    description: str
    distance: str
    price: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class ItineraryDay(BaseModel):
    """Model for a single day in an itinerary"""
    day: int
    date: str
    places: List[Place]
    total_duration: str

class TripPreferences(BaseModel):
    """Model for user trip preferences"""
    destination: str
    duration: str
    travelers: int
    interests: List[str]
    pace: str  # 'relaxed', 'moderate', 'packed'
    budget: str  # 'budget', 'moderate', 'premium'
    special_requirements: Optional[str] = None

class ItineraryRequest(BaseModel):
    """Request model for creating an itinerary"""
    preferences: TripPreferences
    selected_places: Optional[List[str]] = None

class ItineraryResponse(BaseModel):
    """Response model for itinerary creation"""
    id: str
    name: str
    destination: str
    duration: str
    travelers: int
    days: List[ItineraryDay]
    total_cost_estimate: Optional[str] = None
    optimization_score: Optional[float] = None
