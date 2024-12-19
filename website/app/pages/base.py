from flask import Blueprint, render_template


pages_bp = Blueprint("pages", __name__)

@pages_bp.route("/")
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