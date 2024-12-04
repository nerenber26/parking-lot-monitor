from flask import Blueprint, render_template, request, current_app
from sqlalchemy import text

from utils.connectDB import db


views = Blueprint("views", __name__)

@views.route("/", methods=["GET"])
def home_page():
    result = db.session.execute(text("""
        SELECT pl.name, pl.total_spaces, COUNT(ps.id)
        FILTER(WHERE ps.occupied = false) AS available_spaces
        FROM ParkingLots pl LEFT JOIN ParkingSpaces ps ON pl.id = ps.lot_id
        GROUP BY pl.id ORDER BY pl.name
    """))
    rows = result.all()

    return render_template("home.html", page_title="Home", rows=rows)
