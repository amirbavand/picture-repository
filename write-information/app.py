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
from models import FollowInformation

from extensions import db
from PIL import Image as pilim
from sqlalchemy.orm.attributes import flag_modified


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
            img.thumbnail([400, 400])

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


@app.route('/follow', methods=['POST'])
@ token_required
def follow_request(current_user):
    user_name = current_user.userName
    data = request.headers
    user_to_follow = data['userToFollow']
    if(user_name == user_to_follow):
        return jsonify({'message': "you cannot follow yourself"})
    else:
        user_to_follow_information = FollowInformation.query.filter_by(
            userName=user_to_follow).first()
        if(not user_to_follow_information):
            return jsonify({'message': "user does not exist"}), 400
        else:
            user_information = FollowInformation.query.filter_by(
                userName=user_name).first()
            if(user_to_follow_information.isPublic == True):
                new_followers = dict(user_to_follow_information.followers)
                new_followers[user_name] = 'CURRENT'
                user_to_follow_information.followers = new_followers

                new_following = dict(user_information.following)
                new_following[user_to_follow] = 'CURRENT'
                user_information.following = new_following

                db.session.add(user_information)
                db.session.add(user_to_follow_information)

                db.session.commit()
                return jsonify({'status': "followd"})

            else:
                new_requests = dict(user_to_follow_information.followRequests)
                new_requests[user_name] = 'CURRENT'
                user_to_follow_information.followRequests = new_requests

                db.session.add(user_to_follow_information)
                db.session.commit()
                return jsonify({'status': "requested"})


@app.route('/unfollow', methods=['POST'])
@ token_required
def unfollow_request(current_user):
    user_name = current_user.userName
    data = request.headers
    user_to_unfollow = data['userToUnfollow']
    if(user_name == user_to_unfollow):
        return jsonify({'message': "you cannot unfollow yourself"})
    else:
        user_to_unfollow_information = FollowInformation.query.filter_by(
            userName=user_to_unfollow).first()
        if(not user_to_unfollow):
            return jsonify({'message': "user does not exist"}), 400
        else:
            user_information = FollowInformation.query.filter_by(
                userName=user_name).first()
            if(user_name in user_to_unfollow_information.followers):
                new_followers = dict(user_to_unfollow_information.followers)
                new_followers[user_name] = 'OLD'
                user_to_unfollow_information.followers = new_followers

                new_following = dict(user_information.following)
                new_following[user_to_unfollow] = 'OLD'
                user_information.following = new_following

                db.session.add(user_information)
                db.session.add(user_to_unfollow_information)

                db.session.commit()
                return jsonify({'status': "unfollowd"})

            elif(user_name in user_to_unfollow_information.followRequests):
                new_requests = dict(
                    user_to_unfollow_information.followRequests)
                new_requests[user_name] = 'OLD'
                user_to_unfollow_information.followRequests = new_requests

                db.session.add(user_to_unfollow_information)
                db.session.commit()
                return jsonify({'status': "unfollowd"})
            else:
                return jsonify({'status': "badrequest"}), 400


@app.route('/followstatus', methods=['GET'])
@ token_required
def follow_status(current_user):
    user_name = current_user.userName
    data = request.headers
    user_to_follow = data['userToFollow']
    if(user_name == user_to_follow):
        return jsonify({'status': "yourself"})
    else:
        profile_user = FollowInformation.query.filter_by(
            userName=user_to_follow).first()
        if(not profile_user):
            return jsonify({'status': "user does not exist"}), 400
        else:
            if(user_name in profile_user.followers and profile_user.followers[user_name] == 'CURRENT'):
                return jsonify({'status': "following"})
            else:
                if(profile_user.isPublic == True):
                    return jsonify({'status': "not Following"})
                else:
                    if(user_name in profile_user.followRequests and profile_user.followRequests[user_name] == 'CURRENT'):
                        return jsonify({'status': "requested"})
                    else:
                        return jsonify({'status': "not Following"})


if __name__ == '__main__':
    print("hi")

    app.run(host='0.0.0.0', port=5001)
