#ifndef MEASURE_H
#define MEASURE_H
#include <Arduino.h>
#include <Servo.h>
#include <Servo2.h>

class Measure
{
	public:
		Measure();
		void init(int readPIN, int servoPIN);
		void task();
		void config();
		void rotate(float value);
	private:
		enum Status {WASH, BEGIN, SEARCH, TOUCH, BACK, CALC, COMPLETE};
		const int LOOP = 5;
		const float DEFAULT_ROTATION = 0;
		const float MAX_ROTATION = 90;
		//wash
		const float WASH_SEARCH_ROTATION_SPEED = 0.002;
		const int WASH_TIME = 1000;
		const int WASH_END_TIME = 500;
		//search
		const float SEARCH_BACK_ROTATION = 10;
		const float SEARCH_ROTATION_SPEED = 0.001;
		//back
		const int BACK_TIME = 250;
		//to home time
		const int TO_HOME_TIME = 1000;
		Servo2 servo;
		int _readPIN;

		bool touching();
};

#endif