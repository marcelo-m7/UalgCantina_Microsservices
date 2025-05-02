from sqlalchemy.orm import Session
from models.prato import Prato
from schemas.prato import PratoCreate

def get_prato(db: Session, prato_id: int):
    return db.query(Prato).filter(Prato.id == prato_id).first()

def get_pratos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Prato).offset(skip).limit(limit).all()

def create_prato(db: Session, prato: PratoCreate):
    db_prato = Prato(designacao=prato.designacao, alergeno_id=prato.alergeno_id)
    db.add(db_prato)
    db.commit()
    db.refresh(db_prato)
    return db_prato

def delete_prato(db: Session, prato_id: int):
    obj = db.query(Prato).filter(Prato.id == prato_id).first()
    if obj:
        db.delete(obj)
        db.commit()
    return obj

def update_prato(db: Session, prato_id: int, prato_in: PratoCreate):
    obj = db.query(Prato).filter(Prato.id == prato_id).first()
    if obj:
        obj.designacao = prato_in.designacao
        obj.alergeno_id = prato_in.alergeno_id
        db.commit()
        db.refresh(obj)
    return obj
