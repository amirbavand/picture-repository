FROM python:3.6.1-alpine
WORKDIR /"app"
#ADD . /project
COPY ./requirements.txt ./

RUN apk update
#the line bellow has been added to prevent error for installing psycopg2
RUN apk add postgresql-dev gcc python3-dev musl-dev
#the bellow two lines are for problem with installing pillow (for image comparission)
RUN apk add --no-cache jpeg-dev zlib-dev
RUN apk add --no-cache --virtual .build-deps build-base linux-headers  

RUN pip install -r requirements.txt
COPY . .

CMD ["python","app.py"]