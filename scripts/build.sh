#!/bin/bash

if [ -z "${TAP_TOKEN}" ];
then
    echo "==> Please set TAP_TOKEN environment variable (bdcli account tap-client-token)"
    ERROR=1
fi

if [ -z "${TAP_URL}" ];
then
    echo "==> Please set TAP_URL environment variable (see the Data Tap deployment output of the Lambda Function URL)"
    ERROR=1
fi

if [ $ERROR ];
then
    exit 1
fi

cat src/webclient.js | sed "s|TAP_TOKEN|\"${TAP_TOKEN}\"|g" | sed "s|TAP_URL|\"${TAP_URL}\"|g" > __cli.js
#ncc build -a -m -o dist/ __cli.js
esbuild __cli.js --bundle --minify --outfile=dist/index.js