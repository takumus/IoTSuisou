#include <Arduino.h>
#include <Servo.h>
#include <Servo2.h>
void measure();

Servo2 sv1;
unsigned long pt, nt;
bool touch = false;
int pr = 0;
int c = 0;
void setup(){
	Serial.begin(9600);
	pinMode(13,OUTPUT);
	pinMode(11,INPUT);
	sv1.attach(11, 621, 2445, 180);
}
float r = 0;
void loop(){
	char c = Serial.read();
	if(c != -1){
		if(c == 'm'){
			measure();
		}
	}
}
const int MEASURE_LOOP = 5;
void measure(){
	enum Status {BEGIN, SEARCH, TOUCH, CALC, COMPLETE};
	int loop = 0;
	int result = 0;
	float rota = 0;
	float rotas[MEASURE_LOOP];
	float value = 0;
	Status status = BEGIN;
	while(true){
		Serial.println(status);
		if(status == BEGIN){
			rota = 90;
			sv1.write(rota);
			delay(700);
			status = SEARCH;
			continue;
		}
		if(status == SEARCH){
			bool touch = false;
			while(true){
				if(analogRead(0) > 500) {
					if(!touch){
						touch = true;
						status = TOUCH;
						break;
					}
					pt = nt;
				}else{
					if(touch) {
						touch = false;
					}
				}
				sv1.write(rota);
				rota += 0.004;
			}
			continue;
		}
		if(status == TOUCH){
			rotas[loop] = rota;
			Serial.println(rota);
			status = BEGIN;
			loop ++;
			if(loop >= MEASURE_LOOP){
				status = CALC;
			}
			continue;
		}
		if(status == CALC){
			sv1.write(90);
			//ソート
			for(int i = 0; i < MEASURE_LOOP; i ++){
				int minid = i;
				for(int ii = i + 1; ii < MEASURE_LOOP; ii ++){
					if(rotas[minid] > rotas[ii]){
						minid = ii;
					}
				}
				float t = rotas[i];
				rotas[i] = rotas[minid];
				rotas[minid] = t;
			}
			value = rotas[MEASURE_LOOP/2];
			status = COMPLETE;
			result = 0;
			continue;
		}

		if(status == COMPLETE){
			Serial.print("{'type':'measure', 'result':");
			Serial.print(result);
			Serial.print(", 'value':");
			Serial.print(value);
			Serial.print("}\n");
			return;
		}
	}
}
