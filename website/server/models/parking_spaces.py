# from server.extensions import db
#
#
# class ParkingSpaces(db.Model):
#     __tablename__ = 'parking_spaces'
#
#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     lot_id = db.Column(db.Integer, db.ForeignKey('parking_lots.id', ondelete='CASCADE', onupdate='CASCADE'))
#     sensor_id = db.Column(db.Integer, db.ForeignKey('lora_sensors.id', ondelete='SET NULL', onupdate='CASCADE'), nullable=True)
#     occupied = db.Column(db.Boolean, nullable=False, default=False)
#     last_updated = db.Column(db.DateTime, default=db.func.current_timestamp())
#
#     def __repr__(self):
#         return f'<ParkingSpace {self.id}>'
