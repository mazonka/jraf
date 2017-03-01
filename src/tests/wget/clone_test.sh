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
cp $1.out $2.out
test -f $1.sh && cp $1.sh $2.sh
test -f $1_.sh && cp $1_.sh $2_.sh

svn add $2.*
test -f $2_.sh && svn add $2_.sh


