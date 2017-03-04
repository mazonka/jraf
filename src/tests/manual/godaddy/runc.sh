#!/bin/sh

url=http://hasq.org/test.php
url=http://localhost:16001

start=1
end=50

for (( x=$start; x<=$end; x++ ))
do
echo "= = = Iteration $x = = ="

printf -v y "%03d" $x

cmd /c start cmd /c curl $url -o o/curl_$y.out -d "command=jr read 0 /" -D o/curl_$y.head

done
