from sqlalchemy.orm import Session
from models.alergeno import Alergeno
from schemas.alergeno import AlergenoCreate

def get_alergeno(db: Session, alergeno_id: int):
    return db.query(Alergeno).filter(Alergeno.id == alergeno_id).first()

def get_alergenos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Alergeno).offset(skip).limit(limit).all()

def create_alergeno(db: Session, alergeno: AlergenoCreate):
    db_alergeno = Alergeno(nome=alergeno.nome)
    db.add(db_alergeno)
    db.commit()
    db.refresh(db_alergeno)
    return db_alergeno

def delete_alergeno(db: Session, alergeno_id: int):
    obj = db.query(Alergeno).filter(Alergeno.id == alergeno_id).first()
    if obj:
        db.delete(obj)
        db.commit()
    return obj

def update_alergeno(db: Session, alergeno_id: int, alergeno_in: AlergenoCreate):
    obj = db.query(Alergeno).filter(Alergeno.id == alergeno_id).first()
    if obj:
        obj.nome = alergeno_in.nome
        db.commit()
        db.refresh(obj)
    return obj
