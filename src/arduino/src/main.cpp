#include <Arduino.h>
#include "tasks/measure.h"
#include "tasks/feed.h"

Measure measure;
Feed feed;
void setup()
{
	Serial.begin(9600);
	measure.init(0, 11);
	feed.init(10);
}
float r = 0;
void loop()
{
	char c = Serial.read();
	if(c != -1){
		//水位測定
		if(c == 'm'){
			measure.task();
			return;
		}
		//餌やり
		if(c == 'f'){
			String val = Serial.readStringUntil('\n');
			feed.task(val.toInt());
			return;
		}
	}
}