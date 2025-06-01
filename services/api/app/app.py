# app.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date

import config
# import database
import crud
import schemas
from deps import get_db, get_current_user

# Cria tabelas (se não existirem)
# database.init_db()

app = FastAPI(title="API Simplificada - Cantina")

# Configura CORS para permitir acesso do Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# — ROTAS ALLERGEN — #

@app.get("/api/v1/allergens/", response_model=list[schemas.AllergenOut])
def list_allergens(db: Session = Depends(get_db)):
    return crud.get_all_allergens(db)

@app.post(
    "/api/v1/allergens/",
    response_model=schemas.AllergenOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_user)]
)
def create_allergen(allergen_in: schemas.AllergenCreate, db: Session = Depends(get_db)):
    existing = crud.get_allergen(db, allergen_in.id)
    if existing:
        raise HTTPException(status_code=400, detail="Allergen já existe")
    return crud.create_allergen(db, allergen_in)

@app.put(
    "/api/v1/allergens/{allergen_id}",
    response_model=schemas.AllergenOut,
    dependencies=[Depends(get_current_user)]
)
def update_allergen(
    allergen_id: str,
    allergen_in: schemas.AllergenUpdate,
    db: Session = Depends(get_db)
):
    db_obj = crud.get_allergen(db, allergen_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Allergen não encontrado")
    return crud.update_allergen(db, db_obj, allergen_in)

@app.delete(
    "/api/v1/allergens/{allergen_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_user)]
)
def delete_allergen(allergen_id: str, db: Session = Depends(get_db)):
    db_obj = crud.get_allergen(db, allergen_id)
    if not db_obj:
        return
    crud.delete_allergen(db, db_obj)
    return


# — ROTAS DISH — #

@app.get("/api/v1/dishes/", response_model=list[schemas.DishOut])
def list_dishes(db: Session = Depends(get_db)):
    return crud.get_all_dishes(db)

@app.get("/api/v1/dishes/{dish_id}", response_model=schemas.DishOut)
def get_dish(dish_id: str, db: Session = Depends(get_db)):
    db_obj = crud.get_dish(db, dish_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Dish não encontrado")
    return db_obj

@app.post(
    "/api/v1/dishes/",
    response_model=schemas.DishOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_user)]
)
def create_dish(dish_in: schemas.DishCreate, db: Session = Depends(get_db)):
    existing = crud.get_dish(db, dish_in.id)
    if existing:
        raise HTTPException(status_code=400, detail="Dish já existe")
    return crud.create_dish(db, dish_in)

@app.put(
    "/api/v1/dishes/{dish_id}",
    response_model=schemas.DishOut,
    dependencies=[Depends(get_current_user)]
)
def update_dish(dish_id: str, dish_in: schemas.DishUpdate, db: Session = Depends(get_db)):
    db_obj = crud.get_dish(db, dish_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Dish não encontrado")
    return crud.update_dish(db, db_obj, dish_in)

@app.delete(
    "/api/v1/dishes/{dish_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_user)]
)
def delete_dish(dish_id: str, db: Session = Depends(get_db)):
    db_obj = crud.get_dish(db, dish_id)
    if not db_obj:
        return
    crud.delete_dish(db, db_obj)
    return


# — ROTAS PÚBLICAS DE MENU — #

@app.get("/api/v1/public/weekly/", response_model=list[schemas.MenuEntryOut])
def get_public_weekly_menu(db: Session = Depends(get_db)):
    """
    Retorna todas as entradas de menu.
    O frontend pode filtrar por 'date' e 'meal_type'.
    """
    return crud.get_all_menu(db)


# — ROTAS DE EDIÇÃO DE MENU (requer token) — #

@app.get(
    "/api/v1/menus/{date_str}/{meal_type}",
    response_model=schemas.MenuEntryOut,
    dependencies=[Depends(get_current_user)]
)
def get_menu_entry(date_str: str, meal_type: str, db: Session = Depends(get_db)):
    """
    date_str: "YYYY-MM-DD"
    meal_type: "almoco" ou "jantar"
    """
    try:
        dt = date.fromisoformat(date_str)
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato de data inválido")
    db_obj = crud.get_menu_by_date_meal(db, dt, meal_type)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Menu não encontrado")
    return db_obj

@app.post(
    "/api/v1/menus/",
    response_model=schemas.MenuEntryOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_user)]
)
def create_menu_entry(menu_in: schemas.MenuEntryCreate, db: Session = Depends(get_db)):
    existing = crud.get_menu_by_date_meal(db, menu_in.date, menu_in.meal_type)
    if existing:
        raise HTTPException(status_code=400, detail="Já existe entrada para essa data/refeição")
    return crud.create_menu(db, menu_in)

@app.put(
    "/api/v1/menus/{date_str}/{meal_type}",
    response_model=schemas.MenuEntryOut,
    dependencies=[Depends(get_current_user)]
)
def update_menu_entry(date_str: str, meal_type: str, menu_in: schemas.MenuEntryUpdate, db: Session = Depends(get_db)):
    try:
        dt = date.fromisoformat(date_str)
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato de data inválido")
    db_obj = crud.get_menu_by_date_meal(db, dt, meal_type)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Menu não encontrado")
    return crud.update_menu(db, db_obj, menu_in)

@app.delete(
    "/api/v1/menus/{date_str}/{meal_type}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_user)]
)
def delete_menu_entry(date_str: str, meal_type: str, db: Session = Depends(get_db)):
    try:
        dt = date.fromisoformat(date_str)
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato de data inválido")
    db_obj = crud.get_menu_by_date_meal(db, dt, meal_type)
    if not db_obj:
        return
    crud.delete_menu(db, db_obj)
    return
