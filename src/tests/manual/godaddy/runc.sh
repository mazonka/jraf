#!/bin/sh

url=http://hasq.org/test.php
#url=http://localhost:16001
url=http://mazonka.com/box/jrafcl/

rm -f o/curl*

start=1
end=10

for (( x=$start; x<=$end; x++ ))
do
echo "= = = Iteration $x = = ="

printf -v y "%03d" $x

cmd /c start /MIN cmd /c curl $url -o o/curl_$y.out -d "command=jr read 0 /" -D o/curl_$y.head --connect-timeout 15
#cmd /c start cmd /c curl $url -o o/curl_$y.out -D o/curl_$y.head --connect-timeout 15
#curl $url -o o/curl_$y.out -D o/curl_$y.head --connect-timeout 15
sleep 1

done
