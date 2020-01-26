# Tasks





## dev
> Run the service and rebuild on file change

**OPTIONS**
* docker
    * flags: -d --docker
    * desc: Use the docker config instead

~~~bash
set -e # Exit on error
$MASK clean

# Which env config file to use
configfile="dev"
if [[ "$docker" == "true" ]]; then
    configfile="docker"
fi

export PATH="../node_modules/.bin:$PATH" # Add node modules to path
concurrently -p "[{name}]" \
    -n "TypeScript,Node,Config" -c "cyan.bold,green.bold,magenta.bold" \
    "tsc --watch --preserveWatchOutput" \
    "watchexec -w dist -w ../packages -w . --exts js,env -r '$MASK start -s'" \
    "watchexec -w config 'echo \"Updating config...\" && $MASK config $configfile'"
~~~





## start
> Build and run the service

**OPTIONS**
* only_start
    * flags: -s --only-start
    * desc: Skip building

~~~bash
set -e # Exit on error
if [[ "$only_start" != "true" ]]; then
    $MASK config dev
    $MASK build
fi
set -a && source .env # Inject env vars
node dist/index.js
~~~





## build
> Build in production mode

~~~bash
export PATH="../node_modules/.bin:$PATH" # Add node modules to path
$MASK clean
export NODE_ENV=production
tsc
~~~





## image

### image publish
> Build, tag and publish a new docker image

~~~bash
set -e # Exit on error
# Pulls the npm package's version field (v1.2.3)
version=v$(shell npm run env | grep "npm_package_version" | cut -d "=" -f2)
img_name=api-service
latest_tag=$(img_name):latest
version_tag=$(img_name):$(version)
ecr_url=xxxxxxxxxxxxxx.dkr.ecr.us-east-1.amazonaws.com/$(version_tag)

docker build \
    -t $(latest_tag) \
    -t $(version_tag) \
    -f ./Dockerfile .

# Tag and push to ECR
docker tag $version_tag $ecr_url
docker push $ecr_url
~~~





## test

> Run the test suite

**OPTIONS**
* clean
    * flags: -c --clean
    * desc: Clear the jest cache
* watch
    * flags: -w --watch
    * desc: Start jest in watch mode

~~~bash
set -a && source config/env.test # Inject env vars
export PATH="../node_modules/.bin:$PATH" # Add node modules to path
if [[ "$clean" == "true" ]]; then
    jest --verbose --no-cache
elif [[ "$watch" == "true" ]]; then
    jest --verbose --watch
else
    jest --verbose
fi
~~~





## config (app_env)
> Generate config for a specific app environment (dev, docker, test)

~~~bash
set -e # Exit on error
cp "config/env.$app_env" .env
# Also append the gitignored local overrides config...
[ ! -f config/env.overrides ] && touch config/env.overrides
echo "#######################################################################" >> .env
echo "# LOCAL OVERRIDES" >> .env
echo "#######################################################################" >> .env
cat config/env.overrides >> .env
~~~





## create

### create migration (name)
> Create a new database migration

~~~bash
timestamp=$(date +"%Y%m%d%H%M%S")
filename="migrations/${timestamp}_${name// /-}.js"
echo "Creating new migration: $filename"

# Write a basic template
echo "exports.up = knex => {
    return knex.raw(\`\`);
};

exports.down = knex => {
    return knex.raw(\`\`);
};
" > "$filename"
~~~





## format

> Format the project

**OPTIONS**
* check
    * flags: -c --check
    * desc: Show which files are not formatted correctly

~~~bash
export PATH="../node_modules/.bin:$PATH" # Add node modules to path
filter="**/*.{js,jsx,ts,tsx,css,html,json,yml}"

if [[ $check == "true" ]]; then
    prettier "$filter" --ignore-path ../.gitignore --list-different
else
    prettier "$filter" --ignore-path ../.gitignore --write
fi
~~~





## lint
> Lint the project

~~~bash
export PATH="../node_modules/.bin:$PATH" # Add node modules to path
eslint . --ext ts --ignore-pattern dist
~~~





## clean
> Cleans dist

~~~sh
rm -rf dist && mkdir dist
~~~
