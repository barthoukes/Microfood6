#!/usr/bin/env sh

./grpcwebproxy-v0.15.0-linux-x86_64   --backend_addr=localhost:50051   --run_tls_server=false   --server_http_debug_port=8080   --allow_all_origins

