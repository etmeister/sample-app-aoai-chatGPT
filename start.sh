#!/bin/bash

echo ""
echo "Restoring frontend yarn packages"
echo ""
cd frontend
yarn install
if [ $? -ne 0 ]; then
    echo "Failed to restore frontend yarn packages"
    exit $?
fi

echo ""
echo "Building frontend"
echo ""
yarn run build
if [ $? -ne 0 ]; then
    echo "Failed to build frontend"
    exit $?
fi

cd ..
. ./scripts/loadenv.sh

echo ""
echo "Starting backend"
echo ""
./.venv/bin/python -m flask run --port=5000 --host=127.0.0.1 --reload --debug
if [ $? -ne 0 ]; then
    echo "Failed to start backend"
    exit $?
fi
