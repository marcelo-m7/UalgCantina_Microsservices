from sqlalchemy.orm import Session
from models import Ementa


def get_weekly_menu(db: Session):
    return (
        db.query(Ementa)
        .join(Ementa.pratos)
        .order_by(Ementa.data)
        .all()
    )