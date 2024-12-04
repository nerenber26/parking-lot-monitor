# from server.extensions import db
#
#
# class OccupancyEvents(db.Model):
#     __tablename__ = 'occupancy_events'
#
#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     space_id = db.Column(db.Integer, db.ForeignKey('parking_spaces.id'))
#     occupied = db.Column(db.Boolean, nullable=False)
#     event_time = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
#
#     def __repr__(self):
#         return f'<OccupancyEvent {self.id}>'
