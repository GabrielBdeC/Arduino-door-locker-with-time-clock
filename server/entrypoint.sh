#!/bin/sh
sleep 5
echo "Starting migration"
yarn migration:generate
echo "Starting server"
node /dist/main.js