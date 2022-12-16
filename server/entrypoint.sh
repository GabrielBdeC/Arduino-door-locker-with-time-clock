#!/bin/sh
sleep 5
echo "Starting migration"
yarn migration:run
echo "Starting server"
node /dist/main.js