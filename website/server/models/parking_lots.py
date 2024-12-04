# from app.extensions import db
#
#
# class ParkingLots(db.Model):
#     __tablename__ = 'parking_lots'
#
#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     name = db.Column(db.String(100), nullable=False, unique=True)
#     total_spaces = db.Column(db.Integer, nullable=False)
#
#     def __repr__(self):
#         return f'<ParkingLot {self.name}>'
