import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from app.config.logging_config import logger

try:
    import certifi

    os.environ.setdefault("SSL_CERT_FILE", certifi.where())
    os.environ.setdefault("REQUESTS_CA_BUNDLE", certifi.where())
except Exception:
    pass

# Load environment variables
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env")
load_dotenv(dotenv_path=env_path, override=True)

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173").strip()
allowed_origins = [origin.strip() for origin in frontend_url.split(",") if origin.strip()] or ["http://localhost:5173"]

from app.api.routes import router as api_router
from app.api.websocket_manager import ws_manager

app = FastAPI(
    title="AgriPilot Decision Intelligence Backend API",
    description="Agentic AI + Deterministic Optimization Engine for Farmer Decision Intelligence",
    version="1.0.0"
)

# Enable CORS for React Frontend (allowing all localhost dev ports and wildcard origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount REST Routes
app.include_router(api_router)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception(f"[API] Unhandled error on {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "path": request.url.path,
        },
    )

# Mount WebSocket Endpoint
@app.websocket("/ws/market-updates")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep connection alive receiving ping or messages
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"[WebSocket] Unexpected websocket error: {e}")
        logger.debug("WebSocket exception details", exc_info=True)
        ws_manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
