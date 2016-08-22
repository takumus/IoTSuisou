#include <Arduino.h>
#include <Servo.h>
#include <Servo2.h>
Servo2 sv1;
unsigned long pt, nt;
bool touch = false;
int pr = 0;
int c = 0;
void setup(){
	//モニタリングのためシリアル通信開始
	Serial.begin(9600);
	//8番ピンをデジタル出力
	pinMode(13,OUTPUT);
	//9番ピンをデジタル入力
	pinMode(11,INPUT);
	sv1.attach(11, 621, 2445, 180);
}
float r = 0;
void loop(){
	int nr = analogRead(0);
	int dr = nr;
	//dr *= dr<0?-1:1;
	//Serial.println(nr);
	if(dr > 800) {
		nt = micros();
		if(pt + 10000 < nt){
			touch = true;
			c++;
			Serial.println(c);
		}
		pt = nt;
	}else{
		nt = micros();
		if(pt + 10000 < nt){
			if(touch) {
				touch = false;
			}
		}
	}
	r += touch?0.01:-0.01;
	r = r<0?0:r>180?180:r;
	sv1.write(r);
	digitalWrite(13, touch?HIGH:LOW);
}
