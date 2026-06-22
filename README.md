# MNIST Digit Recognizer

A modern, production-grade web application to recognize hand-drawn digits (0-9). The project uses a Convolutional Neural Network (CNN) trained on the MNIST dataset, served by a Flask API backend, and displayed through a premium React + Tailwind CSS client.

---

## Folder Structure

```text
DL_MINI/
│
├── frontend/                     # React + Vite client application
│   ├── public/                   # Public assets
│   ├── src/                      # Source files
│   │   ├── assets/               # CSS and images
│   │   │   └── styles/
│   │   │       └── index.css     # Tailwind and keyframe animation rules
│   │   ├── components/           # Reusable UI elements
│   │   │   ├── Navbar.jsx        # Navigation header
│   │   │   ├── Footer.jsx        # Footer with tech stack info
│   │   │   ├── UploadBox.jsx     # Drawing canvas & file upload logic
│   │   │   ├── PredictionCard.jsx# Glowing card showing predicted digit & score
│   │   │   └── Loader.jsx        # Sleek animated spinner
│   │   ├── pages/                # Section view containers
│   │   │   ├── Home.jsx          # Prediction page layout
│   │   │   ├── About.jsx         # Architecture & MNIST model details
│   │   │   └── Results.jsx       # Detailed bar charts of probabilities
│   │   ├── services/
│   │   │   └── api.js            # Prediction backend request client
│   │   ├── App.jsx               # Navigation router and state coordinator
│   │   └── main.jsx              # React mounting file
│   ├── package.json              # Client dependencies
│   ├── vite.config.js            # Vite configurations
│   └── .env                      # Client environment configurations
│
├── backend/                      # Flask API & Deep Learning inference
│   ├── app.py                    # Server entrypoint and CORS registration
│   ├── config.py                 # File directory initialization & configurations
│   ├── requirements.txt          # Python dependencies
│   ├── train.py                  # Keras CNN model training script
│   ├── model/
│   │   └── mnist_model.h5        # Trained Keras CNN model weights
│   ├── routes/
│   │   └── predict.py            # POST /predict route handler
│   ├── services/
│   │   └── model_service.py      # Singleton to keep model in-memory
│   ├── utils/
│   │   └── preprocess.py         # Inversion, cropping, and centering pipeline
│   ├── uploads/                  # Temporary image uploads (tracked via .gitkeep)
│   └── logs/                     # Server execution logs (tracked via .gitkeep)
│
├── README.md                     # Documentation
└── .gitignore                    # Version control ignore lists
```

---

## Local Development Setup

To run both backend and frontend servers locally:

### 1. Backend Setup

Open a terminal in the root folder (`DL_MINI/`):

1. **Create and activate a virtual environment**:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux:
   source venv/bin/activate
   ```
2. **Install dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. **Start the Flask Backend Server**:
   ```bash
   python backend/app.py
   ```
   *The Flask backend will launch on `http://localhost:8000` by default.*

### 2. Frontend Setup

Open another terminal in the `frontend/` directory:

1. **Install Node modules**:
   ```bash
   npm install
   ```
2. **Run local Vite development server**:
   ```bash
   npm run dev
   ```
   *The React client will launch on `http://localhost:5173`.*

---

## Production Deployment on Render

Render is a cloud hosting platform where you can easily deploy both parts of this application.

### 1. Deploy the Backend (Python Web Service)

1. Connect your GitHub repository to Render.
2. Select **Web Service** as the deployment type.
3. Configure the following details:
   - **Environment**: `Python`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `gunicorn backend.app:app`
4. In the service's **Environment** tab, add:
   - `PORT`: `10000` (or leave it to automatically bind)
   - `FLASK_ENV`: `production`

### 2. Deploy the Frontend (Static Site)

1. Connect the same GitHub repository to Render.
2. Select **Static Site** as the deployment type.
3. Configure the following details:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `frontend/dist`
4. In the static site's **Environment** tab, define:
   - `VITE_API_URL`: `https://your-backend-render-url.onrender.com` *(Replace this with your deployed backend's URL)*
