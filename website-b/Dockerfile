###############################################################################
# Build Executable                                                            #
###############################################################################
FROM docker.io/golang:1.24.2-alpine AS builder

WORKDIR /parking

# download and cache dependencies
COPY ./go.mod ./go.sum ./
RUN go mod download

# copy source code
COPY ./main.go ./main.go
COPY ./app ./app
COPY ./models ./models

# compile standalone executable
RUN go build -ldflags="-s -w" -o parking ./main.go

###############################################################################
# Setup Virtual Environment                                                   #
###############################################################################
FROM docker.io/alpine:3.21

# avoid running as root
RUN addgroup -S parking && adduser -S parking -G parking
USER parking
WORKDIR /home/parking

# copy executable from previous stage
COPY --chown=parking:parking --from=builder /parking/parking /usr/local/bin/parking

ENTRYPOINT ["/usr/local/bin/parking"]