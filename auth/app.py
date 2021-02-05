from flask import Flask, request, jsonify, make_response, send_file
import jwt
import datetime
import os
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import io
from base64 import encodebytes
import random
import string
import base64
from models import User
from models import ImageProduct
from models import DeletedImage
from extensions import db

# from gevent.pywsgi import WSGIServer

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://admin:12345@db/user-login-inforamation'

app.config['SECRET_KEY'] = 'secretkey'
db.init_app(app)
# app.config['UPLOAD_FOLDER'] = '/app/image-repo'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        token = None

        if('x-access-token' in request.headers):

            token = request.headers['x-access-token']

        if(not token):

            return jsonify({'message': 'token is missing'}), 401

        try:
            data = jwt.decode(
                token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(
                userName=data['userName']).first()

        except:
            return jsonify({'message': 'token is invalid'}), 401

        return f(current_user, *args, **kwargs)
    return decorated


@app.route('/register', methods=['POST'])
def create_user():
    data = request.get_json()
    current_user = User.query.filter_by(userName=data['userName']).first()
    user_name = (data['userName']).strip()
    if(data['isPublic'] == True):
        is_public = True
    else:
        is_public = False

    if(current_user):
        return jsonify({'massage': "user already exists."}), 409
    else:
        os.mkdir('/app/image-repository/users/'+user_name)

        os.mkdir('/app/image-repository/users/'+user_name+'/public-preview')
        os.mkdir('/app/image-repository/users/'+user_name+'/private-preview')
        os.mkdir('/app/image-repository/users/'+user_name+'/original-images')

        hashed_password = generate_password_hash(
            data['password'], method='sha256')
        new_user = User(userName=user_name,
                        password=hashed_password, isPublic=is_public)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'massage': "user successfully created"})


@app.route('/login', methods=['POST'])
def login_user():

    auth = request.authorization
    if not auth or not auth.username or not auth.password:
        return make_response('could not verify', 401)
    user = User.query.filter_by(userName=auth.username).first()
    if not user:
        return make_response('could not verify', 401)
    if check_password_hash(user.password, auth.password):
        token = jwt.encode({'userName': user.userName, 'exp': datetime.datetime.utcnow(
        )+datetime.timedelta(minutes=20)}, app.config['SECRET_KEY'])
        return jsonify({'token': token})
    return make_response('could not verify', 401)


@app.route('/', methods=['GET'])
@token_required
def check_access(current_user):
    return jsonify({'massage': "welcome to the site"})


@ app.route('/crdb', methods=['GET'])
def cr_db():
    db.create_all()
    return jsonify({'massage': "db created"})


if __name__ == '__main__':
    print("hi")
 #   db.create_all()   # we have to do this line in the command line (in this case, in the docker container )

    app.run(host='0.0.0.0', port=5000)

  #  WSGIServer(('0.0.0.0', 5000), app).serve_forever()
