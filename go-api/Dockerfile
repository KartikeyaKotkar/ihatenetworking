FROM golang:1.22-bookworm AS builder
WORKDIR /src
COPY go.mod main.go ./
RUN go build -trimpath -ldflags="-s -w" -o /out/go-api .

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends iputils-ping traceroute ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /out/go-api /usr/local/bin/go-api
EXPOSE 8080
ENV PORT=8080
HEALTHCHECK --interval=15s --timeout=3s CMD sh -c 'wget -qO- http://127.0.0.1:8080/health | grep -q ok || exit 1'
CMD ["go-api"]
