# import os
# from fastapi import FastAPI, Query, Path, Body, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles
# from fastapi.responses import FileResponse
# from dotenv import load_dotenv

# from .services.foursquare import search_places, geocode_location
# from .services.itinerary import generate_itinerary
# from .services.huggingface import parse_preferences, analyze_sentiment, extract_locations

# load_dotenv()

# app = FastAPI(title="MinutePlanner API", version="1.0.0")

# # Enable CORS (open for dev, restrict in prod)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Replace with frontend domain in prod
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# #API ROUTES
# @app.get("/api/health")
# async def health():
#     return {"status": "healthy", "service": "MinutePlanner API"}

# @app.get("/api/ping")
# async def ping():
#     return {"message": "pong from FastAPI"}

# @app.get("/api/demo")
# async def demo():
#     return {"message": "Hello from FastAPI Python server"}

# @app.get("/api/places/search")
# async def places_search(
#     ll: str = Query(..., description="lat,lng e.g. 28.6139,77.2090"),
#     query: str = Query("", description="Search query"),
#     limit: int = Query(10, ge=1, le=50),
#     radius: int | None = Query(None, ge=1, le=50000),
#     categories: str | None = None,
# ):
#     try:
#         return await search_places(ll, query, limit)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.get("/api/places/trending/{country}")
# async def trending_places(
#     country: str,
#     limit: int = Query(6, ge=1, le=20),
# ):
#     """
#     Get trending places in a given country.
#     Dynamically geocodes country using Foursquare API.
#     """
#     ll = await geocode_location(country)
#     if not ll:
#         raise HTTPException(status_code=404, detail=f"Could not geocode {country}")

#     try:
#         return await search_places(ll=ll, query="", limit=limit)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.post("/api/itinerary")
# async def itinerary(items: list = Body(...)):
#     print("DEBUG - received payload:", items)
#     return generate_itinerary(items)

# @app.post("/api/preferences/parse")
# async def parse_prefs(body: dict = Body(...)):
#     text = body.get("text")
#     if not text:
#         raise HTTPException(status_code=400, detail="`text` is required")

#     preferences = parse_preferences(text)
#     sentiment = analyze_sentiment(text)
#     locations = extract_locations(text)

#     return {
#         "preferences": preferences,
#         "sentiment": sentiment,
#         "locations": locations,
#         "original_text": text,
#     }

# @app.get("/api/config")
# async def config():
#     maptiler_key = os.getenv("MAPTILER_API_KEY", "")
#     return {
#         "maptiler_url": f"https://api.maptiler.com/maps/streets/style.json?key={maptiler_key}"
#     }


# react_build_dir = os.path.join("client", "dist")

# if os.path.isdir("server/static"):
#     app.mount("/", StaticFiles(directory="server/static", html=True), name="static")

#     @app.get("/{full_path:path}")
#     async def serve_react(full_path: str):
#         index_path = os.path.join("server", "static", "index.html")
#         return FileResponse(index_path)


import os
from fastapi import FastAPI, Query, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv

from .services.foursquare import search_places, trending_places, geocode_place
from .services.itinerary import generate_itinerary
from .services.huggingface import parse_preferences, analyze_sentiment, extract_locations

load_dotenv()

app = FastAPI(title="MinutePlanner API", version="1.1.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- Routes --------------------

@app.get("/api/health")
async def health():
    return {"status": "healthy", "service": "MinutePlanner API"}

@app.get("/api/ping")
async def ping():
    return {"message": "pong from FastAPI"}

@app.get("/api/demo")
async def demo():
    return {"message": "Hello from FastAPI Python server"}

@app.get("/api/places")
async def api_search_places(
    ll: str = Query(..., description="lat,lng e.g. 28.6139,77.2090"),
    query: str = Query("", description="Search query"),
    limit: int = Query(10, ge=1, le=50),
    radius: int | None = Query(None, ge=1, le=50000),
    categories: str | None = None,
):
    try:
        return await search_places(ll, query, limit, radius, categories)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/places/trending")
async def places_trending(
    region: str = Query(..., description="Country/region name (e.g. india, france)"),
    limit: int = Query(6, ge=1, le=50),
):
    try:
        return await trending_places(region, limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/geocode")
async def api_geocode(name: str = Query(...)):
    result = await geocode_place(name)
    if not result:
        return {"error": "Location not found"}
    return result

@app.post("/api/itinerary")
async def itinerary(items: list = Body(...)):
    print("DEBUG - received payload:", items)
    return generate_itinerary(items)

@app.post("/api/preferences/parse")
async def parse_prefs(body: dict = Body(...)):
    text = body.get("text")
    if not text:
        raise HTTPException(status_code=400, detail="`text` is required")

    preferences = parse_preferences(text)
    sentiment = analyze_sentiment(text)
    locations = extract_locations(text)

    return {
        "preferences": preferences,
        "sentiment": sentiment,
        "locations": locations,
        "original_text": text,
    }

@app.get("/api/config")
async def config():
    maptiler_key = os.getenv("MAPTILER_API_KEY", "")
    return {
        "maptiler_url": f"https://api.maptiler.com/maps/streets/style.json?key={maptiler_key}"
    }

# -------------------- Serve React build --------------------
if os.path.isdir("server/static"):
    app.mount("/", StaticFiles(directory="server/static", html=True), name="static")

    @app.get("/{full_path:path}")
    async def serve_react(full_path: str):
        index_path = os.path.join("server", "static", "index.html")
        return FileResponse(index_path)
