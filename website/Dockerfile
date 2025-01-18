###############################################################################
# Build Website Styles                                                        #
###############################################################################
FROM node:22.12-alpine@sha256:51eff88af6dff26f59316b6e356188ffa2c422bd3c3b76f2556a2e7e89d080bd AS node_builder

# avoid running containers as root
USER node
WORKDIR /usr/share/node

# set production environment
ENV NODE_ENV=production

# download and install dependencies. if package.json and package-lock.json
# are unchanged, the cache will be used.
COPY --chown=node:node ./package.json /usr/share/node/package.json
COPY --chown=node:node ./package-lock.json /usr/share/node/package-lock.json
RUN npm ci --omit=dev

# copy tailwindcss configuration files
COPY --chown=node:node ./tailwind.config.js /usr/share/node/tailwind.config.js

# copy source files with tailwindcss attributes
COPY --chown=node:node ./static /usr/share/node/static
COPY --chown=node:node ./templates /usr/share/node/templates

# build website styles
RUN npm run build

###############################################################################
# Setup Application Server                                                    #
###############################################################################
FROM python:3.13-slim-bookworm@sha256:23a81be7b258c8f516f7a60e80943cace4350deb8204cf107c7993e343610d47

WORKDIR /usr/share/python

# prevent python from writing logs and bytecode
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# download and install dependencies. if requirements.txt is unchanged, the cache
# will be used.
COPY --chown=python:python ./requirements.txt /usr/share/python/requirements.txt
RUN pip install --upgrade --user -r /usr/share/python/requirements.txt

# add dependencies to PATH
ENV PATH="${PATH}:/root/.local/bin"

# copy source files of website
COPY --chown=python:python ./wsgi.py /usr/share/python/wsgi.py
COPY --chown=python:python ./app /usr/share/python/app
COPY --chown=python:python ./templates /usr/share/python/templates
COPY --chown=python:python --from=node_builder /usr/share/node/static /usr/share/python/static

EXPOSE 8000

CMD ["gunicorn", "wsgi:create_app()", "--bind", "0.0.0.0:8000"]
