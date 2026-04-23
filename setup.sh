#!/usr/bin/sh

cd "$(dirname "$0")/frontend" || {
    echo "❌ Could not find ocean-search-ui directory"
    exit 1
}

npm install
npm install google-protobuf@3.21.4 --save
npm install @ngx-grpc/common @ngx-grpc/core @ngx-grpc/protoc-gen-ng
npm install @improbable-eng/grpc-web
npm install google-protobuf
npm install -D @types/google-protobuf
npm install -D protoc-gen-grpc-web

