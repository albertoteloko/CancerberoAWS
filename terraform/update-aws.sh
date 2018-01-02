#! /bin/bash

set -e

../lambda/package-all-lambdas.sh
terraform apply -auto-approve