#include <wiringPi.h>
#include <stdio.h>
#include <pthread.h>
#include <vector> 
#include <string>
#include <string.h>
#include <iostream>
#include <time.h>
#include <sys/time.h>
#include <sys/resource.h>

using namespace std;

#define INPUTPIN  6

int main(void)
{
	if(wiringPiSetup() == -1){
		printf("error wiringPi setup\n");
		return 1;
	}
	pullUpDnControl(INPUTPIN, PUD_UP);
	pinMode(INPUTPIN, INPUT);

	while(1){
		delay(100);
		printf("%d\n", digitalRead(INPUTPIN));
	}
	return 0;
}
