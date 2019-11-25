# Tasks

Commands for the entire monorepo.





## bootstrap
> Installs all dependencies and builds all packages

~~~bash
set -e # Exit on error
$MASK install
$MASK build
~~~





## start
> Start the docker stack

**OPTIONS**
* core
    * flags: -c --core
    * desc: Only run the core background services
* background
    * flags: -b --background
    * desc: Do not stream the logs in the foreground

~~~bash
set -e # Exit on error

composefile=""
if [[ "$core" == "true" ]]; then
    composefile="-f docker-compose.core.yml"
fi

visibility=""
if [[ "$background" == "true" ]]; then
    visibility="-d"
fi

cd docker && docker-compose $composefile up $visibility --build

if [[ "$background" == "true" ]]; then
    # Sleep until the database is ready
    until docker exec api_db psql $DB_NAME &>/dev/null; do
        echo "Waiting for the database to be ready..."
        sleep 1s
    done
fi
~~~





## stop
> Stop the docker stack

~~~bash
set -e # Exit on error
cd docker && docker-compose stop
~~~





## logs (container)
> Stream the logs for a docker container

~~~bash
docker logs -f $container
~~~





## install
> Install all dependencies

**OPTIONS**
* clean
    * flags: -c --clean
    * desc: Clean install
* force
    * flags: -f --force
    * desc: Delete the package-lock file

~~~bash
set -e # Exit on error
do_install() {
    project="$1"
    cd "$MASKFILE_DIR/$project"
    if [[ "$clean" == "true" || "$force" == "true" ]]; then
        echo "Clearing dependencies in $project"
        rm -rf node_modules
    fi
    if [[ "$force" == "true" ]]; then
        echo "Deleting the package-lock in file $project"
        rm -rf package-lock.json
    fi

    echo "Installing dependencies in $project"
    if [[ "$force" == "true" ]]; then
        npm install
    else
        npm ci
    fi
}

# Install all project dependencies.
do_install tools
do_install api-service
cd "$MASKFILE_DIR"
for package_dir in packages/*; do
    if [[ -d "$package_dir" ]]; then
        do_install $package_dir
        cd "$MASKFILE_DIR"
    fi
done

# Create a node_modules symlink to the packages directory
# so our projects can share core dependencies.
cd $MASKFILE_DIR
rm -rf node_modules
mv tools/node_modules . # Move global tools to the root
ln -s "$MASKFILE_DIR/packages/" ./node_modules/@
~~~





## build
> Build all packages


**OPTIONS**
* watch
    * flags: -w --watch
    * desc: Rebuild packages on file change

~~~bash
set -e # Exit on error
do_build() {
    project="$1"
    cd "$MASKFILE_DIR/$project"
    echo "Building $project"
    npm run build
}

# Build all packages in a specific order due to how they depend on each other.
do_build packages/config-utils
do_build packages/logger
do_build packages/db-utils
do_build packages/http-utils

# Rebuild packages on file change
cd "$MASKFILE_DIR"
if [[ $watch == "true" ]]; then
    ./node_modules/.bin/concurrently -p "[{name}]" -c "cyan,yellow,green,red" \
        -n "config-utils,logger,db-utils,http-utils" \
        "cd packages/config-utils      && npm run dev" \
        "cd packages/logger            && npm run dev" \
        "cd packages/db-utils          && npm run dev" \
        "cd packages/http-utils        && npm run dev"
fi
~~~





## run (npm_cmd)
> Run an npm cmd inside each package

~~~bash
# Run command inside each package
for package_dir in packages/*; do
    if [[ -d "$package_dir" ]]; then
        cd "$MASKFILE_DIR/$package_dir" && echo "Running inside $package_dir"
        npm run "$npm_cmd"
        cd "$MASKFILE_DIR"
    fi
done
~~~
