#include <wiringPi.h>
#include <stdio.h>
#include <pthread.h>
#include <vector> 
#include <string>
#include <string.h>
#include <iostream>
#include <time.h>
#include <sys/time.h>
#include <sys/resource.h>

using namespace std;

#define OUTPUTPIN  5
#define INPUTPIN  6
int count = 0;
int main()
{
  if (wiringPiSetupGpio() == -1) {
    std::cout << "cannot setup gpio." << std::endl;
    return 1;
  }

  pinMode(6, PWM_OUTPUT);
  pwmSetMode(PWM_MODE_MS);
  pwmSetClock(4000);
  pwmSetRange(1024);

  while (true) {
    int num;
    std::cin >> num;

    if (num == -1) {
      break;
    }

    pwmWrite(6, num);
  }

  return 0;
}