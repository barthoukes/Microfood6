#!/usr/bin/env  sh

# Verify the image exists and is the right one
docker images | grep envoy-contrib

docker run --rm -it \
  -v $(pwd)/envoy.yaml:/etc/envoy/envoy.yaml \
  -p 8080:8080 \
  envoyproxy/envoy-contrib:v1.30-latest \
  -c /etc/envoy/envoy.yaml

