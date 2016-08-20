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

#define OUTPUTPIN  5
#define INPUTPIN  6
int count = 0;
unsigned long getTime()
{
	timeval time;
	gettimeofday(&time, NULL);
	return (time.tv_sec * 1000000ULL + time.tv_usec);
}
void* thread_read(void* args)
{
	while(1){
		
		delayMicroseconds(10);
		while(digitalRead(INPUTPIN) == LOW){}
		count++;
	}
}
void* thread_calc(void* args)
{
	unsigned long pt = 0, nt = 0;
	int pcount = 0;
	while(1){
		nt = getTime();
		if(pt + 50000 < nt ){
			pt = nt;
			if(count > 0)printf("%d\n", (count));
			count = 0;
		}
	}
}
int main(void)
{
	if(wiringPiSetup() == -1){
		printf("error wiringPi setup\n");
		return 1;
	}
	pullUpDnControl(INPUTPIN, PUD_DOWN);
	pinMode(INPUTPIN, INPUT);
	pinMode(OUTPUTPIN, OUTPUT);

	pthread_t _thread_read;
	pthread_create(&_thread_read, NULL, thread_read, (void *)NULL);

	pthread_t _thread_calc;
	pthread_create(&_thread_calc, NULL, thread_calc, (void *)NULL);

	while(1){
	}
	return 0;
}
