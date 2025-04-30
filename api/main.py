from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from db import get_session, get_engine
from sqlalchemy.orm import Session

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # para dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/week")
def get_weekly_menu(session: Session = Depends(get_session)):
    # exemplo de consulta simples
    result = session.execute("""SELECT e.data, p.designacao 
                                 FROM Ementas e
                                 JOIN EmentaPrato ep ON e.id = ep.ementa_id
                                 JOIN Pratos p ON ep.prato_id = p.id
                                 ORDER BY e.data""")
    return [{"data": str(row[0]), "prato": row[1]} for row in result]