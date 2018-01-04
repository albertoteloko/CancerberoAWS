#! /bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "$DIR/../lambda/"
./gradlew buildZip
cd "$DIR"
terraform apply -auto-approve