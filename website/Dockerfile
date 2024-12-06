FROM node:22-alpine as node_builder

WORKDIR /app

COPY server/package*.json /app/

COPY server/tailwind.config.js /app/tailwind.config.js
COPY server/postcss.config.js /app/postcss.config.js

COPY server/static /app/static
COPY server/templates /app/templates

RUN npm install && npm run build
RUN rm ./static/css/default.css


FROM python:3.13-alpine as python_builder

RUN adduser -D admin
USER admin
WORKDIR /home/admin

COPY --chown=admin:admin server/requirements.txt app/requirements.txt
RUN pip wheel --no-cache-dir --no-deps --wheel-dir app/wheels -r app/requirements.txt


FROM python:3.13-alpine as flask_server

RUN adduser -D admin
USER admin
WORKDIR /home/admin

ENV PATH="/home/admin/.local/bin:${PATH}"

COPY --chown=admin:admin --from=python_builder /home/admin/app/wheels app/wheels
COPY --chown=admin:admin --from=python_builder /home/admin/app/requirements.txt app/requirements.txt

RUN pip install --no-cache app/wheels/*

COPY --chown=admin:admin config.py app/config.py
COPY --chown=admin:admin server/extensions app/server/extensions
COPY --chown=admin:admin server/models app/server/models
COPY --chown=admin:admin server/routes app/server/routes
COPY --chown=admin:admin server/templates app/server/templates
COPY --chown=admin:admin server/__init__.py app/server/__init__.py

COPY --chown=admin:admin --from=node_builder /app/static /home/admin/app/server/static

EXPOSE 8000

WORKDIR /home/admin/app
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "server:create_app()"]
