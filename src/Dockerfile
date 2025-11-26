FROM docker.io/node:22-alpine AS base

# Install run-time and compile-time system dependencies
USER root
RUN apk add --no-cache \
    make \
    nodejs \
    bash \
    npm

# Create and switch to non-root user
RUN addgroup -g 1001 runner \
    && adduser -G runner -u 1001 -D runner
USER runner

# Install run-time and compile-time local dependencies

# Create required folders and change to source directory
RUN mkdir -p /home/runner/src \
    /home/runner/src/frontend \
    /home/runner/src/webserver \
    /var/tmp/deps
WORKDIR /home/runner/src

# Install run-time and compile-time project dependencies
COPY --chown=runner:runner frontend/package.json frontend/package-lock.json ./frontend/
COPY --chown=runner:runner webserver/package.json webserver/package-lock.json ./webserver/
RUN cd /home/runner/src/frontend \
    && npm ci \
    && cd /home/runner/src/webserver \
    && npm ci

#
# Production
#

FROM base AS production

# Change to non-root user
USER runner
WORKDIR /home/runner/src

ENV NODE_ENV=production

# Copy source and build
# Frontend build
WORKDIR /home/runner/src/frontend
ARG VITE_BACKEND_URL=http://localhost:8080
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
COPY --chown=runner:runner frontend/ ./
RUN npm run build

# Webserver build
WORKDIR /home/runner/src/webserver
COPY --chown=runner:runner webserver/ ./

# Copy production entrypoint script
COPY --chown=runner:runner ./scripts/entrypoint-prod.sh /var/tmp/

# Expose required ports
EXPOSE 8080

# Define entrypoint (runs migrations before starting)
ENTRYPOINT ["/var/tmp/entrypoint-prod.sh"]

#
# Development
#

FROM base AS development

# Install dev-time system dependencies
USER root
RUN apk add --no-cache \
    libstdc++ \
    curl \
    inotify-tools \
    ripgrep

# Change to non-root user
USER runner

# Install dev-time local dependencies

# Change to source directory
WORKDIR /home/runner/src

# Install dev-time project dependencies

# Move temporally project dependencies and clean source directory
RUN mv ./frontend/node_modules /var/tmp/deps/node_modules_frontend \
    && mv ./webserver/node_modules /var/tmp/deps/node_modules_webserver \
    && find /home/runner/src -mindepth 1 -delete

# Expose required ports
EXPOSE 8080

# Define entrypoint
COPY --chown=runner:runner ./scripts/entrypoint-dev.sh /var/tmp
ENTRYPOINT ["/var/tmp/entrypoint-dev.sh"]

