#!/bin/bash

# Install mask
curl -OL https://github.com/jakedeichert/mask/releases/download/v0.7.1-final/mask-v0.7.1-final-x86_64-unknown-linux-gnu.zip \
    && unzip mask*.zip \
    && mv mask-*/mask /usr/share/rust/.cargo/bin

# Install and build all packages
mask bootstrap
