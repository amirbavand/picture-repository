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


if __name__ == '__main__':
    print("hi")

    app.run(host='0.0.0.0', port=5002)