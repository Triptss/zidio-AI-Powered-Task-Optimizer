from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import tasks_router, emotion_router

app = FastAPI(title="TaskNova API")

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    # Add any other origins if your frontend runs on a different port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks_router.router, prefix="/api/v1", tags=["Tasks"])
app.include_router(emotion_router.router, prefix="/api/v1", tags=["Emotion Analysis"])

@app.get("/")
async def root():
    return {"message": "Welcome to TaskNova Backend!"}

# Uncomment this :- To run this app (if this file is executed directly, for dev):
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, app_dir=".")
# The above uvicorn.run assumes you cd into the 'app' directory first.
# If running from 'backend' directory: uvicorn.run("app.main:app", ...)
