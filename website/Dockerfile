FROM node:22-alpine AS npm

WORKDIR /website

COPY ./package*.json /website/
COPY ./tailwind.config.js /website/tailwind.config.js

COPY ./static /website/static
COPY ./templates /website/templates

RUN npm ci && npm run build

FROM python:3.13-alpine

WORKDIR /website

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

ENV PORT=8000

ENV PATH="${PATH}:/root/.local/bin"

COPY ./requirements.txt /website/requirements.txt

RUN pip install --user -r /website/requirements.txt

COPY ./wsgi.py /website/wsgi.py
COPY ./app /website/app
COPY --from=npm /website/static /website/static
COPY --from=npm /website/templates /website/templates

EXPOSE $PORT

CMD ["gunicorn", "wsgi:create_app()", "--bind", "0.0.0.0:8000", "--workers", "2", "--timeout", "15"]
