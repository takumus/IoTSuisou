#include "light.h"

Light::Light()
{
	
}
void Light::init(int lightPIN)
{
	pin = lightPIN;
	pinMode(lightPIN, OUTPUT);
}

void Light::config()
{
	
}
void Light::task(bool power)
{
	digitalWrite(pin, power?HIGH:LOW);
	
	Serial.print("{\"type\":\"light\"");
	Serial.print(", \"result\":");
	Serial.print(0);
	Serial.print("}\n");
	return;
}