from flask import Flask, request, jsonify, make_response, send_file
import jwt
import datetime
import os
from werkzeug.utils import secure_filename
# from gevent.pywsgi import WSGIServer
from flask_sqlalchemy import SQLAlchemy
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from PIL import Image as pilim
import io
from base64 import encodebytes
import random
import string
import base64


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


class ImageProduct(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(50))
    name = db.Column(db.String(80), unique=True)
    caption = db.Column(db.String(1000))
    isPublic = db.Column(db.Boolean)


class DeletedImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(50))
    imageProduct = db.Column(db.String(80))
    name = db.Column(db.String(80),  unique=True)
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

    if(len(images) > 0):
        os.mkdir('/app/image-repository/users/'+user_name +
                 '/'+'original-images/'+product_name)
        if(not is_public):
            os.mkdir('/app/image-repository/users/'+user_name +
                     '/'+'private-preview/'+product_name)
        else:
            os.mkdir('/app/image-repository/users/'+user_name +
                     '/'+'public-preview/'+product_name)

        new_image_product = ImageProduct(userName=user_name,
                                         name=product_name, caption=image_caption, isPublic=is_public)
        db.session.add(new_image_product)
        db.session.commit()

        for im in images:

            image_name = (''.join(random.choice(letters) for i in range(16)))
            fileName = im.filename
            filenames.append(fileName)

            im.save('/app/image-repository/users/'+user_name +
                    '/'+'original-images/'+product_name+'/'+image_name+".png")
            img = pilim.open('/app/image-repository/users/'+user_name +
                             '/'+'original-images/'+product_name+'/'+image_name+".png")
            img.thumbnail([800, 800])

            if(not is_public):

                img.save('/app/image-repository/users/'+user_name +
                         '/'+'private-preview/'+product_name+'/'+image_name+".png")
            else:

                img.save('/app/image-repository/users/'+user_name +
                         '/'+'public-preview/'+product_name+'/'+image_name+".png")

        return jsonify({'massage': "successfuly uploaded to the  server"})

    else:
        return jsonify({'massage': "No image has been selected"})

    return jsonify({'massage': "hi"})


@app.route('/profile', methods=['GET'])
@token_required
def send_profile_information(current_user):
    image_array = []

    data = request.headers
    user_name = current_user.userName
    profile_user_name = (data['profileUserName'])
    if(user_name != profile_user_name):
        requested_profile_user = User.query.filter_by(
            userName=profile_user_name).first()
        if(not requested_profile_user):
            return jsonify({'massage': "this account does not exist"}), 400

        if(requested_profile_user.isPublic == False):
            # did not check this path
            return jsonify({'massage': "this account is private"})
        else:
            try:
                os.remove('/app/image-repository/users/' +
                          profile_user_name+'/public-preview/.DS_Store')
            except:
                pass

            product_keys = os.listdir(
                '/app/image-repository/users/'+profile_user_name+'/public-preview')
            for product in product_keys:
                if(not product.endswith('.DS_Store')):

                    product_images_list = os.listdir('/app/image-repository/users/'
                                                     + profile_user_name
                                                     + '/public-preview/'
                                                     + product)  # reads the PIL image
                    if(True):
                        #            return jsonify({"massage": product_images_list})
                        product_image_to_preview_name = product_images_list[0]
                        if(product_image_to_preview_name.endswith('.DS_Store')):
                            product_image_to_preview_name = product_images_list[0]

                        with open('/app/image-repository/users/'
                                  + profile_user_name
                                  + '/public-preview/'
                                  + product+'/' +
                                  product_image_to_preview_name, "rb") as img_file:
                            encoded_img = base64.b64encode(img_file.read())
                        encoded_img = str(encoded_img, 'utf-8')

                        image_array.append(encoded_img)

                    else:
                        return jsonify({'massage': "could not handle"})

            return jsonify({'product_keys': product_keys, 'image_preview_list': image_array, 'massage': "successfull"})
    else:

        product_keys = os.listdir(
            '/app/image-repository/users/'+profile_user_name+'/public-preview')
        for product in product_keys:
            if(not product.endswith('.DS_Store')):

                product_images_list = os.listdir('/app/image-repository/users/'
                                                 + profile_user_name
                                                 + '/public-preview/'
                                                 + product)  # reads the PIL image
                try:
                    product_image_to_preview_name = product_images_list[0]

                    with open('/app/image-repository/users/'
                              + profile_user_name
                              + '/public-preview/'
                              + product+'/' +
                              product_image_to_preview_name, "rb") as img_file:
                        encoded_img = base64.b64encode(img_file.read())
                    encoded_img = str(encoded_img, 'utf-8')

                    image_array.append(encoded_img)
                except:
                    return jsonify({"massage": "could not do that"}), 407

        product_keys_private = os.listdir(
            '/app/image-repository/users/'+profile_user_name+'/private-preview')
        for product in product_keys_private:
            if(not product.endswith('.DS_Store')):

                product_images_list = os.listdir('/app/image-repository/users/'
                                                 + profile_user_name
                                                 + '/private-preview/'
                                                 + product)  # reads the PIL image
                try:
                    product_image_to_preview_name = product_images_list[0]

                    with open('/app/image-repository/users/'
                              + profile_user_name
                              + '/private-preview/'
                              + product+'/' +
                              product_image_to_preview_name, "rb") as img_file:
                        encoded_img = base64.b64encode(img_file.read())
                    encoded_img = str(encoded_img, 'utf-8')

                    image_array.append(encoded_img)

                except:
                    return jsonify({"massage": "could not do that"}), 407

        return jsonify({'product_keys': product_keys+product_keys_private, 'image_preview_list': image_array, 'massage': "successfull"})


@ app.route('/productprofile', methods=['GET'])
@ token_required
def send_product_information(current_user):
    image_array = []
    data = request.headers
    user_name = current_user.userName
    product_name = (data['productId'])
    requested_product_profile = ImageProduct.query.filter_by(
        name=product_name).first()
    requested_profile_user = User.query.filter_by(
        userName=requested_product_profile.userName).first()

    if(not requested_profile_user):
        return jsonify("does not exist"), 410

    if(not requested_product_profile):
        return jsonify("does not exist"), 402

    profile_user_name = requested_product_profile.userName
    product_caption = requested_product_profile.caption

    if(user_name != profile_user_name):
        if(requested_profile_user.isPublic == False):
            return jsonify({"massage": "do not have access to this product"}), 403

        if(requested_product_profile.isPublic == False):
            return jsonify({"massage": "do not have access to this product"}), 403

    try:
        os.remove('/app/image-repository/users/'
                  + profile_user_name
                  + '/public-preview/'
                    + product_name+'/.DS_Store')
    except:
        pass

    if(requested_product_profile.isPublic == True):
        product_repository = '/public-preview/'
    else:
        product_repository = '/private-preview/'

    product_images_list = os.listdir('/app/image-repository/users/'
                                     + profile_user_name
                                     + product_repository
                                     + product_name)

    for image in product_images_list:

        with open('/app/image-repository/users/'
                  + profile_user_name
                  + product_repository
                  + product_name+'/' +
                  image, "rb") as img_file:
            encoded_img = base64.b64encode(img_file.read())
        encoded_img = str(encoded_img, 'utf-8')

        image_array.append((encoded_img))

    return jsonify({'image_keys': product_images_list, 'image_preview_list': image_array, 'product_caption': product_caption})


@ app.route('/originalphoto', methods=['GET'])
@token_required
def send_original_image(current_user):
    data = request.headers
    user_name = current_user.userName
    product_name = (data['productId'])
    image_name = (data['imageId'])
    requested_product_profile = ImageProduct.query.filter_by(
        name=product_name).first()
    requested_profile_user = User.query.filter_by(
        userName=requested_product_profile.userName).first()
    if(not requested_profile_user or not requested_product_profile):
        return jsonify("does not exist"), 410

    profile_user_name = requested_product_profile.userName

    if(user_name != profile_user_name):
        if(requested_profile_user.isPublic == False):
            return jsonify({"massage": "do not have access to this product"}), 403

        if(requested_product_profile.isPublic == False):
            return jsonify({"massage": "do not have access to this product"}), 403

    with open('/app/image-repository/users/'
              + profile_user_name
              + '/original-images/'
              + product_name+'/' +
              image_name, "rb") as img_file:
        encoded_img = base64.b64encode(img_file.read())
    encoded_img = str(encoded_img, 'utf-8')

    return jsonify({"imagestr": encoded_img})

  #  return jsonify({"imagestr": str(len(encoded_img))})


@ app.route('/crdb', methods=['GET'])
def cr_db():
    db.create_all()
    return jsonify({'massage': "db created"})


if __name__ == '__main__':
    print("hi")
 #   db.create_all()   # we have to do this line in the command line (in this case, in the docker container )

    app.run(host='0.0.0.0', port=5000)

  #  WSGIServer(('0.0.0.0', 5000), app).serve_forever()
