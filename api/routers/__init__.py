from fastapi import APIRouter

# importa cada router de recurso
from .alergenos import router as alergenos_router
from .pratos    import router as pratos_router
from .ementas   import router as ementas_router
from .auth      import router as auth_router

# cria o router “pai”
api_router = APIRouter()

# monta nele todos os sub-routers
api_router.include_router(auth_router,      prefix="/auth",   tags=["Auth"])
api_router.include_router(alergenos_router, prefix="/alergenos", tags=["Alergenos"])
api_router.include_router(pratos_router,    prefix="/pratos",    tags=["Pratos"])
api_router.include_router(ementas_router,  prefix="/ementas",   tags=["Ementas"])

# opcional: dizer explicitamente o que exportar
__all__ = ["api_router"]
