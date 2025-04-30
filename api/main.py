from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Body
from db import get_session, get_engine
from sqlalchemy.orm import Session
from sqlalchemy import text

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
    query = text("""
        SELECT e.data, p.designacao 
        FROM Ementas e
        JOIN EmentaPrato ep ON e.id = ep.ementa_id
        JOIN Pratos p ON ep.prato_id = p.id
        ORDER BY e.data
    """)
    result = session.execute(query).fetchall()
    return [{"data": str(row[0]), "prato": row[1]} for row in result]

@app.get("/alergenos")
def get_alergenos(session: Session = Depends(get_session)):
    query = text("SELECT id, nome FROM Alergenos ORDER BY nome")
    result = session.execute(query).fetchall()
    return [{"id": row[0], "nome": row[1]} for row in result]

@app.get("/pratos")
def get_pratos(session: Session = Depends(get_session)):
    query = text("SELECT id, designacao FROM Pratos ORDER BY designacao")
    result = session.execute(query).fetchall()
    return [{"id": row[0], "designacao": row[1]} for row in result]

@app.get("/ementas/{data}")
def get_ementa_by_date(data: str, session: Session = Depends(get_session)):
    query = text("""
        SELECT p.designacao
        FROM Ementas e
        JOIN EmentaPrato ep ON e.id = ep.ementa_id
        JOIN Pratos p ON ep.prato_id = p.id
        WHERE e.data = :data
    """)
    result = session.execute(query, {"data": data}).fetchall()
    return {"data": data, "pratos": [row[0] for row in result]}

@app.post("/pratos")
def add_prato(designacao: str = Body(...), session: Session = Depends(get_session)):
    query = text("INSERT INTO Pratos (designacao) VALUES (:designacao)")
    session.execute(query, {"designacao": designacao})
    session.commit()
    return {"status": "ok", "designacao": designacao}

@app.post("/ementas")
def add_ementa(data: str = Body(...), pratos: list[int] = Body(...), session: Session = Depends(get_session)):
    insert_ementa = text("INSERT INTO Ementas (data) VALUES (:data)")
    session.execute(insert_ementa, {"data": data})
    ementa_id = session.execute(text("SELECT LAST_INSERT_ID()")).scalar()

    for prato_id in pratos:
        session.execute(
            text("INSERT INTO EmentaPrato (ementa_id, prato_id) VALUES (:e, :p)"),
            {"e": ementa_id, "p": prato_id}
        )

    session.commit()
    return {"status": "ok", "ementa_id": ementa_id, "data": data, "pratos": pratos}

@app.delete("/ementas/{ementa_id}")
def delete_ementa(ementa_id: int, session: Session = Depends(get_session)):
    session.execute(text("DELETE FROM Ementas WHERE id = :id"), {"id": ementa_id})
    session.commit()
    return {"status": "ementa removida", "ementa_id": ementa_id}