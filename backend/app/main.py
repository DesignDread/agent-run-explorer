import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .routes import router
from .data_loader import data_store

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    data_store.load()
    yield

app = FastAPI(title="Agent Run Explorer API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def read_root():
    return {
        "message": "Agent Run Explorer API is running",
        "docs_url": "/docs",
        "health_url": "/api/health"
    }
