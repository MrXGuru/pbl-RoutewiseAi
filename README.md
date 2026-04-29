<div align="center">
  <img src="https://img.shields.io/badge/Status-Live%20on%20Render-success?style=for-the-badge&logo=render" alt="Status" />
  <img src="https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase" alt="Database" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi" alt="Backend" />
  <img src="https://img.shields.io/badge/Frontend-Vanilla%20JS%20%7C%20TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Frontend" />
  
  <br />
  <br />
  
  <h1>🚀 RouteWise AI</h1>
  <p><b>Next-Generation Route Optimization & Intelligent Transport Recommendations</b></p>

  <p>RouteWise AI is a premium, AI-powered travel platform designed to mathematically optimize your road trips and intelligently recommend multi-modal transport options across India. Built with a sleek glassmorphism UI and powered by a robust Python backend.</p>

  <br />
</div>

## ✨ Key Features

🚗 **AI Route Optimization (Traveling Salesperson)**
Utilizes a powerful **Genetic Algorithm** seeded with a greedy nearest-neighbor approach and refined with **2-Opt local search**. It calculates routes using *live traffic data* from the TomTom API, not just straight-line distances.

⛅ **Intelligent Delay Prediction**
Predicts travel delays by analyzing route segments against real-time weather conditions (OpenWeatherMap) and live traffic incidents.

🚊 **Smart Transport Options**
Instantly query a comprehensive database of **38,000+ real-world flight, train, and bus routes** across India to find the most cost-effective and fastest travel methods.

👤 **Persistent Garage & Profiles**
Secure user authentication allows users to maintain a persistent profile and virtual "Garage" to track their vehicles across devices.

---

## 🛠️ Technology Stack

### Backend
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL hosted on Supabase
- **ORM:** SQLAlchemy (with ultra-fast `execute_values` bulk inserts)
- **Algorithms:** Genetic Algorithms, 2-Opt Refinement, Asynchronous API pooling

### Frontend
- **Design:** Modern Glassmorphism & Micro-animations
- **Styling:** TailwindCSS
- **Mapping:** Leaflet.js
- **Interactivity:** Vanilla JavaScript

### External APIs
- **TomTom Routing API:** Live traffic, base travel time, and route pathing.
- **OpenWeatherMap API:** Live weather segment analysis.
- **TomTom Geocoding API:** Coordinate resolution.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- PostgreSQL (Supabase recommended)
- API Keys for TomTom and OpenWeatherMap

### Local Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MrXGuru/pbl-RoutewiseAi.git
   cd pbl-RoutewiseAi
   ```

2. **Set up Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://[user]:[password]@[pooler-url]:6543/postgres
   TOMTOM_API_KEY=your_tomtom_key
   OWM_API_KEY=your_openweathermap_key
   ```

5. **Load the Database**
   *Note: Ensure your `flight`, `train`, and `bus` JSON datasets are in the root folder.*
   ```bash
   python load_db.py
   ```

6. **Run the Application**
   ```bash
   uvicorn backend.main:app --reload
   ```
   Open `http://127.0.0.1:8000` in your browser.

---

## 🧠 How the AI Optimizer Works
Our `optimizer.py` avoids simple point-to-point drawing. 
1. The backend triggers parallel asynchronous calls to TomTom to build a true **Cost Matrix** of actual driving times in seconds.
2. A **Genetic Algorithm** simulates generations of route mutations to find the fastest sequence of stops.
3. A final **2-Opt Refinement** pass untangles any crossing paths.
4. The backend returns a hyper-optimized JSON payload, which the frontend visualizes instantly using Leaflet.js.

---

<div align="center">
  <b>Designed with ❤️ by Team MapSquad</b>
</div>
