#ifndef FEED_H
#define FEED_H
#include <Arduino.h>
#include <Servo.h>
#include <Servo2.h>

class Feed
{
	public:
		Feed();
		void init(int servoPIN);
		void task(int loop);
		void config();
		void rotate(float value);
	private:
		Servo2 servo;
};

#endif