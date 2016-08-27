#include "feed.h"

Feed::Feed()
{
	
}
void Feed::init(int servoPIN)
{
	servo.attach(servoPIN, 681, 2685, 180);
	servo.power(false);
}

void Feed::config()
{
	
}
void Feed::task(int loop)
{
	if(loop <= 0 || loop > 20) {
		Serial.print("{\"type\":\"feed\"");
		Serial.print(", \"result\":");
		Serial.print(1);
		Serial.print("}\n");
		return;
	}
	servo.power(true);
	for(int i = 0; i < loop; i ++){
		servo.write(180);
		delay(1500);
		servo.write(0);
		delay(1500);
	}
	servo.power(false);
	Serial.print("{\"type\":\"feed\"");
	Serial.print(", \"result\":");
	Serial.print(0);
	Serial.print("}\n");
	return;
}