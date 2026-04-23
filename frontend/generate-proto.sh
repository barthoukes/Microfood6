#!/bin/bash

# Paths (your proto files are in the parent directory)
PROTO_DIR="../proto"  # Parent directory (Microfood6)
OUTPUT_DIR="src/app/generated"

# Create output directory
mkdir -p $OUTPUT_DIR

echo "Generating TypeScript from proto files..."
echo "Proto directory: $PROTO_DIR"
echo "Output directory: $OUTPUT_DIR"
echo ""

# Check if proto files exist
echo "Proto files found:"
ls -la $PROTO_DIR/*.proto 2>/dev/null | head -5

# Generate TypeScript files
npx protoc \
  --plugin=node_modules/@protobuf-ts/plugin/bin/protoc-gen-ts \
  --ts_opt=generate_dependencies \
  --ts_opt=long_type_string \
  --ts_out=$OUTPUT_DIR \
  --proto_path=$PROTO_DIR \
  $PROTO_DIR/*.proto 2>&1

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ gRPC TypeScript files generated successfully!"
  echo ""
  echo "Generated files:"
  ls -la $OUTPUT_DIR/*.ts 2>/dev/null | wc -l
  ls -la $OUTPUT_DIR/*.ts 2>/dev/null | head -10
else
  echo ""
  echo "❌ Generation failed. Check errors above."
fi
