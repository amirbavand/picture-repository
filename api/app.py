from flask import Flask, request, jsonify, make_response
import jwt
import datetime
import os
from werkzeug.utils import secure_filename
# from gevent.pywsgi import WSGIServer
from flask_sqlalchemy import SQLAlchemy
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from PIL import Image as im
import random
import string
import io
from base64 import encodebytes


# from gevent.pywsgi import WSGIServer

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://admin:12345@db/user-login-inforamation'
db = SQLAlchemy(app)

app.config['SECRET_KEY'] = 'secretkey'
# app.config['UPLOAD_FOLDER'] = '/app/image-repo'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(80))
    isPublic = db.Column(db.Boolean)


class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(50))
    name = db.Column(db.String(80))
    caption = db.Column(db.String(1000))
    isPublic = db.Column(db.Boolean)


class DeletedImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(50))
    name = db.Column(db.String(80))
    caption = db.Column(db.String(1000))


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        print(request.headers)

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

    if(current_user):
        return jsonify({'massage': "user already exists."}), 409
    else:
        os.mkdir('/app/image-repository/'+data['userName'])

        os.mkdir('/app/image-repository/'+data['userName']+'/public-preview')
        os.mkdir('/app/image-repository/'+data['userName']+'/private-preview')
        os.mkdir('/app/image-repository/'+data['userName']+'/original-images')
        os.mkdir('/app/image-repository/'+data['userName']+'/deleted-images')

        hashed_password = generate_password_hash(
            data['password'], method='sha256')
        new_user = User(userName=data['userName'],
                        password=hashed_password, isPublic=True)
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
        )+datetime.timedelta(minutes=2)}, app.config['SECRET_KEY'])
        return jsonify({'token': token})
    return make_response('could not verify', 401)


@app.route('/', methods=['GET'])
@token_required
def check_access(current_user):
    return jsonify({'massage': "welcome to the site"})


@app.route('/upload', methods=['POST'])
def add_imagee():
    images = request.files.getlist('myImage')
    for im in images:
        fileName = im.filename
        im.save('/app/image-repository/admin' +
                '/'+'private-preview/'+fileName)

#    return jsonify({'massage': "hiiiiiii"})

    return jsonify({'massage': str(len(images))})


@ app.route('/uploadd', methods=['POST'])
@ token_required
def add_image(current_user):

    images = request.files['myImage']
    caption = request.form['imageCaption']
    fileName = request.form['myImageName']
    if(request.form['isPrivate'] == 'true'):
        isPrivate = True
    else:
        isPrivate = False
    imageExists = Image.query.filter_by(
        userName=current_user.userName, name=fileName).first()
    if imageExists:
        return jsonify({'massage': "the file with this name already exists"}), 403
    else:

        image.save(os.path.join('/app/image-repository/' +
                                current_user.userName+'/'+'original-images', fileName))
        img = im.open('/app/image-repository/'+current_user.userName +
                      '/'+'original-images/'+fileName)
        img.thumbnail([1024, 1024])
    # img = img.convert('RGB')
        # the bellow should be jpg
        if(isPrivate):
            img.save('/app/image-repository/'+current_user.userName +
                     '/'+'private-preview/'+fileName)
        else:
            img.save('/app/image-repository/'+current_user.userName +
                     '/'+'public-preview/'+fileName)
        new_image = Image(userName=current_user.userName,
                          name=fileName, caption=caption, isPublic=not isPrivate)
        db.session.add(new_image)
        db.session.commit()

        return jsonify({'massage': str(isPrivate)})


@app.route('/profile', methods=['GET'])
# @token_required
# def send_profile_information(current_user):
def send_profile_information():
    image_array = []

    arr = os.listdir('/app/image-repository/admin/private-preview')
    for image_path in arr:
        pil_img = im.open('/app/image-repository/admin/private-preview/' +
                          image_path, mode='r')  # reads the PIL image
        byte_arr = io.BytesIO()
    # convert the PIL image to byte array
        pil_img.save(byte_arr, format='PNG')
        encoded_img = encodebytes(byte_arr.getvalue()).decode(
            'ascii')  # encode as base64
        image_array.append(encoded_img)

    return jsonify({'massage': image_array})


if __name__ == '__main__':
    print("hi")
 #   db.create_all()   # we have to do this line in the command line (in this case, in the docker container )

    app.run(host='0.0.0.0', port=5000)

  #  WSGIServer(('0.0.0.0', 5000), app).serve_forever()
