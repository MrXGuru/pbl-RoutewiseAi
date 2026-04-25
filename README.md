# 🌟 RouteWise AI
*Next-Generation Smart Travel Planning & Route Navigation Dashboard*

<div align="center">

![RouteWise AI Dashboard](screenshots/dashboard.png)

[![Python](https://img.shields.io/badge/Python-3.8+-FFD43B?style=for-the-badge&logo=python&logoColor=blue)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://javascript.com)
[![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)

</div>

---

RouteWise AI is a complete full-stack web application designed to optimize travel planning by integrating live map routing, granular weather delay forecasting, and multimodal transport cost comparisons into a single premium interface.

**Created by Team MapSquad**: Nandan Garg, Ayush Juyal, and Avish Pradhan.

## ✨ Core Features

* 🗺️ **Intelligent Leaflet Maps**: Interactive geographical rendering allowing point-to-point map visualization built with Leaflet.js.
* 🌤️ **Granular Weather Segmentation**: The backend divides user routes into 6 distinct chunks, using asynchronous processing via `aiohttp` to instantly fetch location-specific weather segments (Temperature, Humidity, Wind, Condition) from the OpenWeatherMap API, giving precise delay factors.
* 🚇 **Transport Finder**: Cost and travel-time comparisons among flights, trains, and buses dynamically scored by an internal algorithm to find the "Cheapest" and "Fastest" multimodal options.
* 🔐 **Glassmorphism UI**: A highly polished, modern login, signup, and dashboard experience designed with pure CSS glassmorphism, responsive grid layouts, and smooth transition animations.
* 👤 **User Profiles & Vehicles**: Manage personal profile parameters and configured vehicles seamlessly within the dashboard.

---

## 📸 **UI SHOWCASE**

<div align="center">

### 🔐 Multi-Screen Authentication
![Login Screen](screenshots/login.png)
*Premium glassmorphism dashboard login and interactive signup flows.*

---

### 🗺️ Intelligent Dashboard
![Dashboard](screenshots/dashboard.png)
*Interactive Leaflet maps embedded with real-time multi-stop routing forms.*

---

### 🌤️ Live Weather Segmentation
![Delay Prediction](screenshots/delay_prediction.png)
*Granular 6-chunk weather analysis detailing wind, humidity, and temperature along your exact route predicting active delays.*

---

### 🚇 Transport AI Finder
![Transport Options](screenshots/transport.png)
*Automatically scored multimodal transport options comparing trains, buses, and flights exclusively on cost and speed efficiency.*

---

### 👤 Profile & Vehicle Management
![Profile](screenshots/profile.png)
*Organize your vehicles and user settings seamlessly directly within the app.*

</div>

---

## 💎 **TECHNOLOGY STACK**

### 🎨 Frontend
* **Core**: Vanilla HTML5, CSS3, ES6 JavaScript
* **Mapping**: Leaflet.js
* **Styling**: Custom CSS Framework with Glassmorphism
* **Icons**: FontAwesome 6

### 🚀 Backend
* **Server Framework**: FastAPI (Python 3.8+)
* **Asynchronous Networking**: `asyncio` & `aiohttp` for parallel external API resolution
* **Database**: SQLAlchemy (SQLite)

### 📡 External APIs
* **TomTom Traffic API**: Powers the live geo-routing and driving estimations.
* **OpenWeatherMap API**: Powers the segmented weather grid and conditions.

---

## 🚀 **GETTING STARTED**

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/MrXGuru/pbl-RoutewiseAi.git
cd routewiseAI_final_22
```

### 2️⃣ Create & Activate Virtual Environment
```bash
# macOS/Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### 3️⃣ Install Dependencies
```bash
pip install -r requirements.txt
```

### 4️⃣ Setup Environment Variables
Create a `.env` file in the root configuration with the following keys:
```env
# Example .env Configuration
OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
TOMTOM_API_KEY=your_tomtom_api_key
DATABASE_URL=sqlite:///./routewise.db
```

### 5️⃣ Boot the Server Launch
Start the highly-concurrent backend API using Uvicorn:
```bash
export PYTHONPATH=. 
uvicorn backend.main:app --reload
```

Then open your browser and navigate to exactly: **`http://localhost:8000`**

---

## 🤝 **CONTRIBUTING**

Contributions are perfectly welcome! Since RouteWise AI is a PBL educational initiative, if you'd like to extend its ML components or UI styling further:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<p align="center">
  <b>🚀 Made by Team MapSquad</b><br>
  <a href="https://www.linkedin.com/in/23nandan/">Nandan Garg</a> · 
  <a href="https://www.linkedin.com/in/ayushjuyal/">Ayush Juyal</a> · 
  <a href="https://www.linkedin.com/in/avishpradhan0014/">Avish Pradhan</a>
</p>
