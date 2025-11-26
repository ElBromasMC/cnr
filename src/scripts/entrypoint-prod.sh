#!/bin/bash

set -e

cd /home/runner/src/webserver

echo "Waiting for database to be ready..."
echo "POSTGRESQL_URL: ${POSTGRESQL_URL:-(not set)}"

# Simple wait for PostgreSQL - retry connection
MAX_RETRIES=30
RETRY_COUNT=0

until node -e "
const { Sequelize } = require('sequelize');
const url = process.env.POSTGRESQL_URL;
console.log('Attempting connection to:', url ? url.replace(/:[^:@]+@/, ':***@') : 'URL not set');
if (!url) {
  console.error('POSTGRESQL_URL is not set');
  process.exit(1);
}
const db = new Sequelize(url, {
  dialect: 'postgres',
  logging: false
});
db.authenticate()
  .then(() => { console.log('Connection successful'); process.exit(0); })
  .catch((err) => { console.error('Connection failed:', err.message); process.exit(1); });
"; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "Error: Database not available after $MAX_RETRIES attempts" >&2
        exit 1
    fi
    echo "Waiting for database... (attempt $RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done

echo "Database is ready!"

# Run migrations
echo "Running database migrations..."
npm run db:migrate

# Run seeders if RUN_SEEDERS is set (useful for first deployment)
if [ "${RUN_SEEDERS}" = "true" ]; then
    echo "Running database seeders..."
    npm run db:seed
fi

# Start the application
echo "Starting the application..."
exec node index.js
