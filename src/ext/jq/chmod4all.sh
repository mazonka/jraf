#!/bin/sh

# Set files permissions into the zip archive
# and re-pack them to tar.bz2
# 
# Just copy zip-archive here and run script

ARC_NAME=$(ls jquery-ui-*.custom.zip)
DIR_NAME=${ARC_NAME%.zip}

error() {
	[ -z "$1" ] || echo "$1"
	exit 1
}

[ -f "${ARC_NAME}" ] || error "${ARC_NAME} not found!"


unzip "$ARC_NAME" || error "Unzip error"
[ -d "${DIR_NAME}" ] || error "Archive error"

[ -f "${ARC_NAME}" ] && mv "${ARC_NAME}" "${ARC_NAME}.old"
[ -f "${DIR_NAME}.tar.bz2" ] && mv "${DIR_NAME}.tar.bz2" "${DIR_NAME}.tar.bz2.old"

chmod -R 777 "${DIR_NAME}"
tar cjf "${DIR_NAME}.tar.bz2" "${DIR_NAME}" && rm -rf "${DIR_NAME}"
