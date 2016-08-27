#include "feed.h"

Feed::Feed()
{
	
}
void Feed::init(int servoPIN)
{
	servo.attach(servoPIN, 681, 2685, 180);
	//servo.power(false);	
	task();
}

void Feed::config()
{
	
}
void Feed::task()
{
	Status status = WASH;
	servo.power(true);
	while(true){
		servo.write((float)analogRead(0) / 1024 * 180);
	}
	servo.power(false);
}