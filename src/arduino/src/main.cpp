#include <Arduino.h>
#include "tasks/measure.h"
#include "tasks/feed.h"

Measure measure;
Feed feed;
void setup()
{
	Serial.begin(9600);
	measure.init(0, 9);
	feed.init(10);
}
float r = 0;
void loop()
{
	char c = Serial.read();
	if(c != -1){
		if(c == 'm'){
			measure.task();
		}
	}
}