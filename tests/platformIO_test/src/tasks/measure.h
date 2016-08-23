#ifndef SUB_H
#define SUB_H
#include <Arduino.h>
#include <Servo.h>
#include <Servo2.h>

class Measure
{
	public:
		Measure();
		void init();
		void task();
		void config();
		void rotation(float rotation);
	private:
		enum Status {WASH, BEGIN, SEARCH, TOUCH, BACK, CALC, COMPLETE};
		const int READ_PIN = 0;
		const int LOOP = 30;
		const float DEFAULT_ROTATION = 0;
		const float MAX_ROTATION = 90;
		//wash
		const float WASH_SEARCH_ROTATION_SPEED = 0.001;
		const int WASH_TIME = 5000;
		const int WASH_END_TIME = 500;
		//search
		const float SEARCH_BACK_ROTATION = 15;
		const float SEARCH_ROTATION_SPEED = 0.01;
		//back
		const int BACK_TIME = 250;
		Servo2 servo;

		bool touching();
};

#endif