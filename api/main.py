from fastapi import FastAPI
from routers import api_router

def get_application() -> FastAPI:
    app = FastAPI(
        title="API de Ementas",
        version="0.1.0",
        description="API REST para gestão de ementas, pratos e alergénios"
    )
    app.include_router(api_router)
    return app

app = get_application()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
