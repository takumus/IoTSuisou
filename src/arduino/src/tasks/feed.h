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
		void task();
		void config();
		void rotate(float value);
	private:
		enum Status {WASH, BEGIN, SEARCH, TOUCH, BACK, CALC, COMPLETE};
		Servo2 servo;
};

#endif