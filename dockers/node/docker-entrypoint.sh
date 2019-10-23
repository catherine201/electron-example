#!/bin/sh
if [ ! -d node_modules ]; then
    npm install

fi

if [ ! -d logs ]; then
    mkdir logs
fi

npm run build


exec "$@"

