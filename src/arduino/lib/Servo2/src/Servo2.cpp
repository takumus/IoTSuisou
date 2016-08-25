#include <Arduino.h>
#include "Servo2.h"

void Servo2::attach(int out, int minPulse, int maxPulse, int maxRotation)
{
    _servo.attach(out, minPulse, maxPulse);
    _out = out;
    _minPulse = minPulse;
    _maxPulse = maxPulse;
    _maxRotation = maxRotation;
    _defPulse = maxPulse - minPulse;
    _power = true;
}
void Servo2::write(float rotation)
{
    if(rotation > _maxRotation) rotation = _maxRotation;
    if(rotation < 0) rotation = 0;
    _rotation = rotation;
    _servo.writeMicroseconds(rotation / _maxRotation * _defPulse + _minPulse);
}
void Servo2::power(bool p)
{
   if(p == _power) return;
   _power = p;
   if(p){
       _servo.attach(_out, _minPulse, _maxPulse);
   }else{
       _servo.detach();
   }
}
float Servo2::read()
{
    return _rotation;
}
