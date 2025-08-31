# MinutePlanner

A full-stack trip planning application using React (frontend), FastAPI (backend), and integrations with Foursquare and HuggingFace APIs.

---

## Project Structure

```
main/
├── client/      # React frontend
├── server/      # FastAPI backend and services
├── shared/      # Shared models/utilities
├── public/      # Static assets
├── .env         # Environment variables
├── package.json # Node.js dependencies
├── requirements.txt # Python dependencies
├── ...          # Config and setup files
```

---

## Getting Started

### 1. Install Dependencies

**Node.js (Frontend):**
```bash
cd main
npm install
# or
pnpm install
```

**Python (Backend):**
```bash
pip install -r requirements.txt
```

---

### 2. Run the Backend

```bash
cd main
uvicorn server.main:app --reload --host 0.0.0.0 --port 8000
```

---

### 3. Run the Frontend

```bash
cd main
npm run dev
# or
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment Variables

Edit `.env` to set your API keys and configuration:

```
FOURSQUARE_API_KEY=your_foursquare_key
HF_API_KEY=your_huggingface_key
VITE_MAPLIBRE_API_KEY=your_maplibre_key
PORT=8000
VITE_API_BASE_URL=/api
NODE_ENV=development
```

---

## Main Features

- **Trip Planning:** Suggests itineraries based on user preferences.
- **Map Integration:** Uses MapLibre for interactive maps.
- **API Integrations:** Foursquare for places, HuggingFace for NLP.
- **Responsive UI:** Built with React and reusable UI components.

---

## Folder Details

- `client/pages/`: React pages/routes.
- `client/components/`: UI and map components.
- `client/hooks/`: Custom React hooks.
- `client/lib/`: Utilities and API client.
- `server/main.py`: FastAPI backend entry.
- `server/services/`: External API and business logic.
- `shared/`: Shared models for API requests/responses.

---

## License

MIT

---

## Contributing

Feel free to open issues