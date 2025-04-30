from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from db import get_session, get_engine
from sqlalchemy.orm import Session
from sqlalchemy import text  # ✅ IMPORTANTE para queries puras

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/week")
def get_weekly_menu(session: Session = Depends(get_session)):
    query = text("""
        SELECT e.data, p.designacao 
        FROM Ementas e
        JOIN EmentaPrato ep ON e.id = ep.ementa_id
        JOIN Pratos p ON ep.prato_id = p.id
        ORDER BY e.data
    """)
    result = session.execute(query).fetchall()
    return [{"data": str(row[0]), "prato": row[1]} for row in result]
