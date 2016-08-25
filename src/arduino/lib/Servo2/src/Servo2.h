#ifndef SERVO2_
#define SERVO2_

#include <Arduino.h>
#include <Servo.h>
 
class Servo2
{
public:
    void attach(int out, int minPulse, int maxPulse, int maxRotation);
    void write(float rotation);
    void power(bool p);
    float read();
private:
    int _out, _minPulse, _maxPulse;
    bool _power;
    float _maxRotation;
    float _defPulse, _defRotation;
    float _rotation;
    Servo _servo;
};
 
#endif
