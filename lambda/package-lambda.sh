#!/bin/bash
 
set -e 
 
FUNCTION_NAME=$1 
 
CURRENT_DIR=${pwd} 
 
TMP_DIR=`mktemp -d` 
 
echo "TMP dir: $TMP_DIR" 
 
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" 
 
echo "Packaging $FUNCTION_NAME lambda" 
 
cp -r "$DIR/$FUNCTION_NAME/." "$TMP_DIR/." 
 
if [ "$FUNCTION_NAME" != "common" ]; then 
   echo "Copying common files." 
   cp -r -n "$DIR/common/." "$TMP_DIR/." 
fi 
 
cd "$TMP_DIR" 
 
PACKAGE_FILE="package.json" 
if [ -f $PACKAGE_FILE ]; then 
   echo "File $PACKAGE_FILE exists." 
   npm install 
else 
   echo "File $PACKAGE_FILE does not exist." 
fi 
 
zip -q -r "$DIR/domo-slave-$FUNCTION_NAME.zip" . * 
cd "$CURRENT_DIR" 
rm -rf "$TMP_DIR" 
 
echo "Packaged $FUNCTION_NAME lambda"