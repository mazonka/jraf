#!/bin/sh

cwd=`sh execdir.sh`
wr=$cwd/wroot
echo ""
echo "=="
find $wr/.jraf.sys/ -maxdepth 2 -type d | xargs -n1 ls -1
echo "=="
ls -1 $wr/.jraf.sys/login/
rm -rf $wr



