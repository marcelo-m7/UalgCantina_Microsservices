from sqlalchemy.orm import Session
from models.ementa import Ementa
from schemas.ementa import EmentaCreate

def get_ementa(db: Session, ementa_id: int):
    return db.query(Ementa).filter(Ementa.id == ementa_id).first()

def get_ementas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Ementa).offset(skip).limit(limit).all()

def create_ementa(db: Session, ementa: EmentaCreate):
    db_ementa = Ementa(data=ementa.data, prato_id=ementa.prato_id)
    db.add(db_ementa)
    db.commit()
    db.refresh(db_ementa)
    return db_ementa

def delete_ementa(db: Session, ementa_id: int):
    obj = db.query(Ementa).filter(Ementa.id == ementa_id).first()
    if obj:
        db.delete(obj)
        db.commit()
    return obj

def update_ementa(db: Session, ementa_id: int, ementa_in: EmentaCreate):
    obj = db.query(Ementa).filter(Ementa.id == ementa_id).first()
    if obj:
        obj.data = ementa_in.data
        obj.prato_id = ementa_in.prato_id
        db.commit()
        db.refresh(obj)
    return obj
