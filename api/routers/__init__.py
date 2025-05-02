from fastapi import APIRouter
from routers import alergenos, pratos, ementas

api_router = APIRouter()
api_router.include_router(alergenos.router)
api_router.include_router(pratos.router)
api_router.include_router(ementas.router)
