# project/api/routers/allergens.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import models
from ..schemas import Allergen, AllergenCreate, AllergenUpdate # Import necessary schemas
from ..dependencies import get_db # Assuming get_db is still the way to get DB session
from ..auth import verify_token # Import the verify_token dependency

router = APIRouter(
    prefix="/allergens",
    tags=["allergens"],
    # dependencies=[Depends(get_current_user)], # Uncomment if authentication is required
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[Allergen])
def read_allergens(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    allergens = db.query(models.Allergen).offset(skip).limit(limit).all()
    return allergens

@router.post("/", response_model=Allergen)
def create_allergen(allergen: AllergenCreate, db: Session = Depends(get_db), current_user: dict = Depends(verify_token)):\
    db_allergen = models.Allergen(**allergen.model_dump())
    db.add(db_allergen)
    db.commit()
    db.refresh(db_allergen)
    return db_allergen

@router.put("/{allergen_id}", response_model=schemas.Allergen)
def update_allergen(allergen_id: str, allergen: AllergenUpdate, db: Session = Depends(get_db), current_user: dict = Depends(verify_token)):\
    db_allergen = db.query(models.Allergen).filter(models.Allergen.id == allergen_id).first()
    if db_allergen is None:
        raise HTTPException(status_code=404, detail="Allergen not found")
    
    for field, value in allergen.model_dump(exclude_unset=True).items():
        setattr(db_allergen, field, value)

    db.commit()
    db.refresh(db_allergen)
    return db_allergen

@router.delete("/{allergen_id}")
def delete_allergen(allergen_id: str, db: Session = Depends(get_db), current_user: dict = Depends(verify_token)):\
    db_allergen = db.query(models.Allergen).filter(models.Allergen.id == allergen_id).first()
    if db_allergen is None:
        raise HTTPException(status_code=404, detail="Allergen not found")
    
    db.delete(db_allergen)
    db.commit()
    return {"detail": "Allergen deleted successfully"}