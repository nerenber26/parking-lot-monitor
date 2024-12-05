from flask import Blueprint, render_template
from sqlalchemy import text

from server.extensions import db


bp = Blueprint("pages", __name__)

@bp.route("/")
def home_page():
    rows = [
        ("Main Lot", 100, 77),
        ("Bauccio Commons Lot", 50, 10),
        ("Waldschmidt Lot", 75, 33),
        ("Shiley Lot", 120, 120),
        ("Christie Lot", 60, 0),
        ("Kenna Lot", 30, 0),
        ("Portsmouth Lot", 40, 20),
    ]
    return render_template("home.html", rows=rows)
    # result = db.session.execute(text("""
    #     SELECT pl.name, pl.total_spaces, COUNT(ps.id)
    #     FILTER(WHERE ps.occupied = false) AS available_spaces
    #     FROM ParkingLots pl LEFT JOIN ParkingSpaces ps ON pl.id = ps.lot_id
    #     GROUP BY pl.id ORDER BY pl.name
    # """))
    # rows = result.all()
    #
    # return render_template("home.html", page_title="Home", rows=rows)
