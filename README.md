# JRAF - JavaScript Remote Active Files

Jraf is a JavaScript library and protocol between JavaScript client
and server backend. At this moment there are two backends implemented:

1. In C++ running http lightweight fast service
2. In PHP - lower performance, but easy start

## Why would I use it?
If you develop a web site that has to store client data
without using a database and that has the infinite flexibility,
then Jraf might be a choice.

Try our demos. You may find them interesting or useful.

## Why Jraf is useful?
Jraf provides a transparent link between files on the server
and widgets in the browser page. The server filesystem is
lazy reflected in the hierarchy of JavaScript objects inside
the page. The main concept in Jraf is 'bind'. It binds an
element of the filesystem (file or directory) with
a particular action inside the page. For example, if a file
on the server is changed, then the action is automatically
invoked. At the same time user interaction with the page
can initiate changes in the filesystem on the server.

