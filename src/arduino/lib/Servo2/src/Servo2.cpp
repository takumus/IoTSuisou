#include <Arduino.h>
#include "Servo2.h"

void Servo2::attach(int out, int minPulse, int maxPulse, int maxRotation)
{
    _servo.attach(out, minPulse, maxPulse);
    _minPulse = minPulse;
    _maxPulse = maxPulse;
    _maxRotation = maxRotation;
    _defPulse = maxPulse - minPulse;
}
void Servo2::write(float rotation)
{
    if(rotation > _maxRotation) rotation = _maxRotation;
    if(rotation < 0) rotation = 0;
    _rotation = rotation;
    _servo.writeMicroseconds(rotation / _maxRotation * _defPulse + _minPulse);
}
float Servo2::read()
{
    return _rotation;
}
