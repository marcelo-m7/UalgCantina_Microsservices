from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
from db import get_session, get_engine

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
    # agora com text(...)
    sql = text("""
        SELECT e.data, p.designacao 
        FROM Ementas e
        JOIN EmentaPrato ep ON e.id = ep.ementa_id
        JOIN Pratos p ON ep.prato_id = p.id
        ORDER BY e.data
    """)
    result = session.execute(sql)
    return [
        {"data": str(row.data), "prato": row.designacao}
        for row in result
    ]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
