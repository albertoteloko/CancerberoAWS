#! /bin/bash

set -e

INPUT_FILE=Cancerbero.json

aws cloudformation create-stack --stack-name Cancerbero --template-body file://$INPUT_FILE --capabilities CAPABILITY_NAMED_IAM