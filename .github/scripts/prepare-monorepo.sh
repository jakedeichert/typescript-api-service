#!/bin/bash

# Install mask
curl -OL https://github.com/jakedeichert/mask/releases/download/v0.7.1/mask-v0.7.1-x86_64-apple-darwin.zip \
    && unzip mask*.zip \
    && mv mask-*/mask /usr/share/rust/.cargo/bin

# Install and build all packages
mask bootstrap
