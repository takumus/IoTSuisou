#ifndef LIGHT_H
#define LIGHT_H
#include <Arduino.h>

class Light
{
	public:
		Light();
		void init(int lightPIN);
		void task(bool power);
		void config();
	private:
		int pin;
};

#endif