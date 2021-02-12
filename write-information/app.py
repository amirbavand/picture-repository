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
from PIL import Image as pilim


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


@app.route('/upload', methods=['POST'])
@ token_required
def add_imagee(current_user):
    user_name = current_user.userName
    letters = string.ascii_letters

    product_name = (''.join(random.choice(letters) for i in range(16)))
    filenames = []
    if(request.form['isPrivate'] == 'true'):
        is_public = False
    else:
        is_public = True

    images = request.files.getlist('myImage')
    image_caption = request.form['imageCaption']
    image_title = request.form['imageTitle']
    current_time = datetime.datetime.now()

    if(len(images) > 0):
        os.mkdir('/app/image-repository/users/'+user_name +
                 '/'+'original-images/'+product_name)
        os.mkdir('/app/image-repository/users/'+user_name +
                 '/'+'preview/'+product_name)

        for im in images:

            image_name = (''.join(random.choice(letters) for i in range(16)))
            fileName = im.filename
            filenames.append(fileName)

            im.save('/app/image-repository/users/'+user_name +
                    '/'+'original-images/'+product_name+'/'+image_name+".png")
            img = pilim.open('/app/image-repository/users/'+user_name +
                             '/'+'original-images/'+product_name+'/'+image_name+".png")
            img.thumbnail([800, 800])

            img.save('/app/image-repository/users/'+user_name +
                     '/'+'preview/'+product_name+'/'+image_name+".png")

        new_image_product = ImageProduct(userName=user_name,
                                         name=product_name, productTitle=image_title, caption=image_caption,
                                         isPublic=is_public, dateUploaded=current_time)
        db.session.add(new_image_product)
        db.session.commit()

        return jsonify({'massage': "successfuly uploaded to the  server"})

    else:
        return jsonify({'massage': "No image has been selected"})

    return jsonify({'massage': "hi"})


if __name__ == '__main__':
    print("hi")

    app.run(host='0.0.0.0', port=5001)
