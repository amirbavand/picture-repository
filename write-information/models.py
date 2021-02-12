from extensions import db  # import db instance from __init__.py in app directory
from sqlalchemy.dialects.postgresql import JSON


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(80))
    isPublic = db.Column(db.Boolean)
    dateCreated = db.Column(db.DateTime)


class ImageProduct(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(50))
    name = db.Column(db.String(80), unique=True)
    productTitle = db.Column(db.String(80))
    caption = db.Column(db.String(1000))
    isPublic = db.Column(db.Boolean)
    dateUploaded = db.Column(db.DateTime)


class DeletedImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(50))
    imageProduct = db.Column(db.String(80))
    name = db.Column(db.String(80),  unique=True)
    caption = db.Column(db.String(1000))


class FollowInformation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(50))
    following = db.Column(JSON)
    followers = db.Column(JSON)
