FROM node:12.13.1-stretch-slim

RUN apt-get update && apt-get install -y unzip

# Install utilities...
RUN curl -OL https://github.com/jakedeichert/mask/releases/download/v0.7.1-final/mask-v0.7.1-final-x86_64-unknown-linux-gnu.zip \
    && unzip mask*.zip \
    && mv mask-*/mask /usr/bin

#########################################################################
# PACKAGES SETUP
#########################################################################
WORKDIR /root/packages/config-utils
COPY packages/config-utils/package.json packages/config-utils/package-lock.json ./
RUN npm ci

WORKDIR /root/packages/db-utils
COPY packages/db-utils/package.json packages/db-utils/package-lock.json ./
RUN npm ci

WORKDIR /root/packages/http-utils
COPY packages/http-utils/package.json packages/http-utils/package-lock.json ./
RUN npm ci

WORKDIR /root/packages/logger
COPY packages/logger/package.json packages/logger/package-lock.json ./
RUN npm ci

#########################################################################
# ROOT/TOOLS SETUP
#########################################################################
WORKDIR /root
COPY tsconfig.base.json ./
WORKDIR /root/tools
COPY tools/package.json tools/package-lock.json ./
RUN npm ci \
    && mv node_modules /root/node_modules \
    && ln -s /root/packages/ /root/node_modules/@

#########################################################################
# SERVICE SETUP
#########################################################################
WORKDIR /root/service
COPY api/package.json api/package-lock.json ./
RUN npm ci
COPY api/tsconfig.json api/maskfile.md ./

# Start the service
CMD ["mask", "dev", "-d"]

EXPOSE 8080
