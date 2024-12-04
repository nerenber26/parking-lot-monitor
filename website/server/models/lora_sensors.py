# from server.extensions import db
#
#
# class LoRaSensors(db.Model):
#     __tablename__ = 'lora_sensors'
#
#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     secret = db.Column(db.String(100), nullable=False, unique=True)
#
#     def __repr__(self):
#         return f'<LoRaSensor {self.id}>'
