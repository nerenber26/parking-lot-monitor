FROM docker.io/golang:1.24-bookworm AS builder

WORKDIR /usr/share/golang

COPY main.go go.mod go.sum ./
COPY ./app ./app
COPY ./database ./database
COPY ./handlers ./handlers
COPY ./middlewares ./middlewares
COPY ./static ./static
COPY ./views ./views

RUN go mod download
RUN go build -o main .

FROM docker.io/debian:bookworm

RUN mkdir -p /app

COPY --from=builder /usr/share/golang/main /app/main

WORKDIR /app
CMD ["./main"]