from datetime import datetime, timedelta

def generate_itinerary(items: list):
    """
    Simple itinerary generator: assign timeslots sequentially.
    items: list of dicts with { 'name': str, 'location': str }
    """
    itinerary = []
    current_time = datetime.now().replace(hour=9, minute=0, second=0, microsecond=0)

    for place in items:
        entry = {
            "name": place.get("name"),
            "location": place.get("location"),
            "time": current_time.strftime("%H:%M")
        }
        itinerary.append(entry)
        current_time += timedelta(hours=2)

    return {"itinerary": itinerary}
