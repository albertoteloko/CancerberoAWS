#!/bin/bash

set -e

CURRENT_DIR=${pwd}
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

$DIR/package-lambda.sh api-gateway
$DIR/package-lambda.sh event-handler
