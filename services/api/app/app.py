# services/api/app/app.py

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from datetime import date

import config
import crud, models, schemas
from database import engine, Base
from deps import get_db, verify_token

app = FastAPI(
    title="API Cantina",
    version="1.0.0",
    description="API para gerenciamento de menus e pratos da cantina"
)

# Adiciona CORS
app.add_middleware(
    CORSMiddleware,
    # allow_origins=config.settings.allowed_origins_list,~
    allow_origin_regex=".*",          # <— libera qualquer origem
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    
)

@app.get("/public/weekly/", response_model=schemas.WeeklyMenuOut)
def get_public_weekly_menu(db: Session = Depends(get_db)):
    hoje = date.today()

    weekly = (
        db.query(models.WeeklyMenu)
        # .filter(models.WeeklyMenu.start_date <= hoje)
        # .filter(models.WeeklyMenu.end_date >= hoje)
        .order_by(models.WeeklyMenu.start_date.desc())   # pega o mais recente
        .first()                                         # ← executa!
    )

    if not weekly:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nenhum menu semanal encontrado."
        )

    return weekly          # agora é um objeto WeeklyMenu, não Query


# ==================================================
#   As tabelas JÁ foram criadas pelos scripts do MySQL
#   Portanto, não chamamos Base.metadata.create_all(). 
#   Mantemos o import de models apenas para garantir ORM mapping.
# ==================================================
# Base.metadata.create_all(bind=engine)


# --- ROTAS ALLERGENS (Público: GET; Protegido: POST, PUT, DELETE) ---
@app.get("/allergens/", response_model=list[schemas.AllergenOut])
def list_allergens(db: Session = Depends(get_db)):
    return crud.get_all_allergens(db)


@app.post(
    "/allergens/",
    response_model=schemas.AllergenOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(verify_token)]
)
def create_allergen(allergen_in: schemas.AllergenCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_allergen(db, allergen_in)
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Alérgeno já existe")


@app.put(
    "/allergens/{allergen_id}",
    response_model=schemas.AllergenOut,
    dependencies=[Depends(verify_token)]
)
def update_allergen(allergen_id: str, allergen_in: schemas.AllergenUpdate, db: Session = Depends(get_db)):
    updated = crud.update_allergen(db, allergen_id, allergen_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Alérgeno não encontrado")
    return updated


@app.delete(
    "/allergens/{allergen_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(verify_token)]
)
def delete_allergen(allergen_id: str, db: Session = Depends(get_db)):
    existing = crud.get_allergen(db, allergen_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Alérgeno não encontrado")
    crud.delete_allergen(db, allergen_id)
    return None


# --- ROTAS DISHES (Público: GET; Protegido: POST, PUT, DELETE) ---
@app.get("/dishes/", response_model=list[schemas.DishOut])
def list_dishes(db: Session = Depends(get_db)):
    return crud.get_all_dishes(db)


@app.get("/dishes/{dish_id}", response_model=schemas.DishOut)
def retrieve_dish(dish_id: str, db: Session = Depends(get_db)):
    dish = crud.get_dish(db, dish_id)
    if not dish:
        raise HTTPException(status_code=404, detail="Prato não encontrado")
    return dish


@app.post(
    "/dishes/",
    response_model=schemas.DishOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(verify_token)]
)
def create_dish(dish_in: schemas.DishCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_dish(db, dish_in)
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Prato já existe ou dado inválido")


@app.put(
    "/dishes/{dish_id}",
    response_model=schemas.DishOut,
    dependencies=[Depends(verify_token)]
)
def update_dish(dish_id: str, dish_in: schemas.DishUpdate, db: Session = Depends(get_db)):
    updated = crud.update_dish(db, dish_id, dish_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Prato não encontrado")
    return updated


@app.delete(
    "/dishes/{dish_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(verify_token)]
)
def delete_dish(dish_id: str, db: Session = Depends(get_db)):
    existing = crud.get_dish(db, dish_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Prato não encontrado")
    crud.delete_dish(db, dish_id)
    return None


# --- ROTAS WEEKLY_MENUS (Protegido: CRUD completo) ---
# Lista → .all()
@app.get("/weekly-menus/", response_model=list[schemas.WeeklyMenuOut])
def list_weekly_menus(db: Session = Depends(get_db)):
    return db.query(models.WeeklyMenu).all()

# Obter por id → .first() ou .one()
@app.get("/weekly-menus/{week_id}", response_model=schemas.WeeklyMenuOut)
def retrieve_weekly_menu(week_id: str, db: Session = Depends(get_db)):
    weekly = db.query(models.WeeklyMenu).filter_by(week_id=week_id).first()
    if not weekly:
        raise HTTPException(status_code=404, detail="WeeklyMenu não encontrado")
    return weekly

@app.get("/menus/weekly-admin/", response_model=list[schemas.WeeklyMenuOut])
def list_weekly_menus_admin(db: Session = Depends(get_db)):
    return crud.get_all_weekly_menus(db)



@app.post(
    "/weekly-menus/",
    response_model=schemas.WeeklyMenuOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(verify_token)]
)
def create_weekly_menu(menu_in: schemas.WeeklyMenuCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_weekly_menu(db, menu_in)
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Week já existe ou dados inválidos")


@app.put(
    "/weekly-menus/{week_id}",
    response_model=schemas.WeeklyMenuOut,
    dependencies=[Depends(verify_token)]
)
def update_weekly_menu(week_id: str, menu_in: schemas.WeeklyMenuUpdate, db: Session = Depends(get_db)):
    updated = crud.update_weekly_menu(db, week_id, menu_in)
    if not updated:
        raise HTTPException(status_code=404, detail="WeeklyMenu não encontrado")
    return updated


@app.delete(
    "/weekly-menus/{week_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(verify_token)]
)
def delete_weekly_menu(week_id: str, db: Session = Depends(get_db)):
    existing = crud.get_weekly_menu(db, week_id)
    if not existing:
        raise HTTPException(status_code=404, detail="WeeklyMenu não encontrado")
    crud.delete_weekly_menu(db, week_id)
    return None


# --- ROTAS DAY_MENUS (Protegido: CRUD parcial – lista e vincular entradas) ---
@app.get("/day-menus/", response_model=list[schemas.DayMenuOut])
def list_day_menus(db: Session = Depends(get_db)):
    return crud.get_all_day_menus(db)


@app.get("/day-menus/{date_str}", response_model=schemas.DayMenuOut)
def retrieve_day_menu(date_str: str, db: Session = Depends(get_db)):
    try:
        data = date.fromisoformat(date_str)
    except ValueError:
        raise HTTPException(status_code=400, detail="Data inválida (use YYYY-MM-DD)")
    day = crud.get_day_menu(db, data)
    if not day:
        raise HTTPException(status_code=404, detail="DayMenu não encontrado")
    return day


@app.post(
    "/day-menus/",
    response_model=schemas.DayMenuOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(verify_token)]
)
def create_day_menu(day_in: schemas.DayMenuCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_day_menu(db, day_in)
    except IntegrityError:
        raise HTTPException(status_code=400, detail="DayMenu já existe ou dados inválidos")


@app.put(
    "/day-menus/{date_str}",
    response_model=schemas.DayMenuOut,
    dependencies=[Depends(verify_token)]
)
def update_day_menu(date_str: str, day_in: schemas.DayMenuUpdate, db: Session = Depends(get_db)):
    try:
        data = date.fromisoformat(date_str)
    except ValueError:
        raise HTTPException(status_code=400, detail="Data inválida (use YYYY-MM-DD)")
    updated = crud.update_day_menu(db, data, day_in)
    if not updated:
        raise HTTPException(status_code=404, detail="DayMenu não encontrado")
    return updated


@app.delete(
    "/day-menus/{date_str}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(verify_token)]
)
def delete_day_menu(date_str: str, db: Session = Depends(get_db)):
    try:
        data = date.fromisoformat(date_str)
    except ValueError:
        raise HTTPException(status_code=400, detail="Data inválida (use YYYY-MM-DD)")
    existing = crud.get_day_menu(db, data)
    if not existing:
        raise HTTPException(status_code=404, detail="DayMenu não encontrado")
    crud.delete_day_menu(db, data)
    return None


# --- ROTAS MENU_ENTRIES (Protegido: CRUD completo) ---
@app.get("/", response_model=list[schemas.MenuEntryOut])
@app.get("/menu-entries/", response_model=list[schemas.MenuEntryOut])
def list_menu_entries(db: Session = Depends(get_db)):
    return crud.get_all_menu_entries(db)


@app.get("/menu-entries/{entry_id}", response_model=schemas.MenuEntryOut)
def retrieve_menu_entry(entry_id: str, db: Session = Depends(get_db)):
    entry = crud.get_menu_entry(db, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="MenuEntry não encontrado")
    return entry


@app.post(
    "/menu-entries/",
    response_model=schemas.MenuEntryOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(verify_token)]
)
def create_menu_entry(entry_in: schemas.MenuEntryCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_menu_entry(db, entry_in)
    except IntegrityError:
        raise HTTPException(status_code=400, detail="MenuEntry já existe ou dados inválidos")


@app.put(
    "/menu-entries/{entry_id}",
    response_model=schemas.MenuEntryOut,
    dependencies=[Depends(verify_token)]
)
def update_menu_entry(entry_id: str, entry_in: schemas.MenuEntryUpdate, db: Session = Depends(get_db)):
    updated = crud.update_menu_entry(db, entry_id, entry_in)
    if not updated:
        raise HTTPException(status_code=404, detail="MenuEntry não encontrado")
    return updated


@app.delete(
    "/menu-entries/{entry_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(verify_token)]
)
def delete_menu_entry(entry_id: str, db: Session = Depends(get_db)):
    existing = crud.get_menu_entry(db, entry_id)
    if not existing:
        raise HTTPException(status_code=404, detail="MenuEntry não encontrado")
    crud.delete_menu_entry(db, entry_id)
    return None
