#!/bin/sh

if [ "$2" == "" ]; then
echo Use name1 name2
exit
fi

if [ "$2" == "$1" ]; then
echo Same names
exit
fi

cp $1.i $2.i
cp $1.o $2.o
cp $1.sh $2.sh

svn add $2.*


