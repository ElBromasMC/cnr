#!/bin/bash

set -e

cd /home/runner/src/frontend

# Check if "node_modules" exists in the current directory.
if [ -d "node_modules" ]; then
    echo "Found node_modules in the current directory. Removing it..."
    rm -rf "node_modules"
fi

# Check if "node_modules_frontend" exists in the /var/tmp/deps directory.
if [ -d "/var/tmp/deps/node_modules_frontend" ]; then
    echo "Found node_modules_frontend in /var/tmp/deps. Moving it to the current directory..."
    mv "/var/tmp/deps/node_modules_frontend" ./node_modules
else
    echo "Error: node_modules_frontend folder not found in /var/tmp/deps." >&2
    exit 1
fi

cd /home/runner/src/webserver

# Check if "node_modules" exists in the current directory.
if [ -d "node_modules" ]; then
    echo "Found node_modules in the current directory. Removing it..."
    rm -rf "node_modules"
fi

# Check if "node_modules_webserver" exists in the /var/tmp/deps directory.
if [ -d "/var/tmp/deps/node_modules_webserver" ]; then
    echo "Found node_modules_webserver in /var/tmp/deps. Moving it to the current directory..."
    mv "/var/tmp/deps/node_modules_webserver" ./node_modules
else
    echo "Error: node_modules_webserver folder not found in /var/tmp/deps." >&2
    exit 1
fi

# Run database migrations if RUN_MIGRATIONS is set
if [ "${RUN_MIGRATIONS}" = "true" ]; then
    echo "Running database migrations..."
    npm run db:migrate

    # Run seeders if RUN_SEEDERS is also set
    if [ "${RUN_SEEDERS}" = "true" ]; then
        echo "Running database seeders..."
        npm run db:seed
    fi
fi

exec /bin/bash

