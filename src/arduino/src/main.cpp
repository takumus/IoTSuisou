#include <Arduino.h>
#include "tasks/measure.h"

Measure measure;
void setup()
{
	Serial.begin(9600);
	measure.init();
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