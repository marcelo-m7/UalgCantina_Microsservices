# api/main.py 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import uvicorn

# Load environment variables from env file
load_dotenv()

from db import Base as db  # Import
from routers import allergens, dishes, menus

# Create database tables on startup
@db.Base.metadata.create_all(bind=db.engine)
def create_tables():
    pass  # This function body is not executed, it's just a decorator placeholder

# Create FastAPI app
app = FastAPI()

# Configure CORS
# You might want to restrict this in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(allergens.router, prefix="/api/v1")
app.include_router(dishes.router, prefix="/api/v1")
app.include_router(menus.router, prefix="/api/v1")

# Run the app if executed directly
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
