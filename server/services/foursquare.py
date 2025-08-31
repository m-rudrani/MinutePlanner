import httpx
import os

FOURSQUARE_API_KEY = os.getenv("FOURSQUARE_API_KEY")
BASE_URL = "https://api.foursquare.com/v3/places"

headers = {"Authorization": FOURSQUARE_API_KEY}

async def geocode_place(name: str):
    """Convert city/place name → lat/lng using Foursquare geocoding"""
    url = f"{BASE_URL}/search"
    params = {"query": name, "limit": 1}
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=headers, params=params)
        resp.raise_for_status()
        data = resp.json()
        if not data.get("results"):
            return None
        loc = data["results"][0]["geocodes"]["main"]
        return {"latitude": loc["latitude"], "longitude": loc["longitude"]}

async def search_places(query: str, ll: str, limit: int = 10):
    """Search places by query (e.g. 'museum', 'cafe')."""
    url = f"{BASE_URL}/search"
    params = {"query": query, "ll": ll, "limit": limit}
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=headers, params=params)
        resp.raise_for_status()
        return _normalize_places(resp.json())


async def trending_places(ll: str, limit: int = 10):
    """Get trending places around given coordinates."""
    url = f"{BASE_URL}/trending"
    params = {"ll": ll, "limit": limit}
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=headers, params=params)
        resp.raise_for_status()
        return _normalize_places(resp.json())


def _normalize_places(data: dict):
    """Convert Foursquare response into frontend-friendly format."""
    results = []
    for place in data.get("results", []):
        geocodes = place.get("geocodes", {}).get("main", {})
        results.append({
            "id": place.get("fsq_id"),
            "name": place.get("name"),
            "latitude": geocodes.get("latitude"),
            "longitude": geocodes.get("longitude"),
            "category": place.get("categories", [{}])[0].get("name"),
            "rating": place.get("rating"),
            "price": place.get("price"),
            "duration": place.get("duration"),  # if API provides
        })
    return results
