SCRIPT_DIR=$(dirname $(readlink --canonicalize-existing "$0"))
pushd $SCRIPT_DIR

if [ -f "package-lock.json" ]; then
    npm ci
else
    npm i	
fi

npm run start
