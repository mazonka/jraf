//The following program fails on Win7-64  with g++
//	g++ (GCC) 4.9.2
//	Copyright (C) 2014 Free Software Foundation, Inc.

//It just exists without any errors on call pthread_create

//======================================
#include <iostream>
#include <pthread.h>
using namespace std;
void *print_message(void*){ cout << "Threading\n"; }
int main() {
    pthread_t t1;
    cout << "Hello1\n";
    pthread_create(&t1, NULL, &print_message, NULL);
    cout << "Hello2\n";
}
