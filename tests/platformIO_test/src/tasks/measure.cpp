#include "measure.h"

Measure::Measure()
{
	
}
void Measure::init()
{
	servo.attach(11, 731, 2585, 180);
	rotation(DEFAULT_ROTATION);
}

void Measure::config()
{
	
}
void Measure::task()
{
	int loop = 0;
	int result = 0;
	float rota = 0;
	float rotas[LOOP];
	float value = -1;
	Status status = WASH;
	while(true){
		Serial.print("status:");
		Serial.println(status);
		if(status == WASH){
			rota = DEFAULT_ROTATION;
			while(true){
				if(touching()) {
					delay(WASH_TIME);
					rota = DEFAULT_ROTATION;
					rotation(rota);
					delay(WASH_END_TIME);
					status = BEGIN;
					break;
				}
				//水面が無い
				if(rota > MAX_ROTATION){
					result = 1;
					status = COMPLETE;
					break;
				}
				rotation(rota);
				rota += WASH_SEARCH_ROTATION_SPEED;
			}
			continue;
		}
		if(status == BEGIN){
			//一番上に持ってきたのに
			//タッチ判定だったら
			if(touching()){
				result = 2;
				status = COMPLETE;
				continue;
			}
			status = SEARCH;
			continue;
		}
		if(status == SEARCH){
			while(true){
				if(touching()) {
					status = TOUCH;
					break;
				}
				//水面が無い
				if(rota > MAX_ROTATION){
					result = 1;
					status = COMPLETE;
					break;
				}
				rotation(rota);
				rota += SEARCH_ROTATION_SPEED;
			}
			continue;
		}
		if(status == TOUCH){
			rotas[loop] = rota;
			status = BACK;
			loop ++;
			if(loop >= LOOP){
				status = CALC;
			}
			continue;
		}
		if(status == BACK){
			rota -= SEARCH_BACK_ROTATION;
			rotation(rota);
			delay(BACK_TIME);
			status = BEGIN;
			/*
			while(true){
				if(backRota > rota){
					status = BEGIN;
					break;
				}
				rotation(rota);
				rota -= SEARCH_ROTATION_SPEED;
			}
			*/
			continue;
		}
		if(status == CALC){
			rotation(DEFAULT_ROTATION);
			/*
			//ソート
			for(int i = 0; i < LOOP; i ++){
				int minid = i;
				for(int ii = i + 1; ii < LOOP; ii ++){
					if(rotas[minid] > rotas[ii]){
						minid = ii;
					}
				}
				float t = rotas[i];
				rotas[i] = rotas[minid];
				rotas[minid] = t;
			}
			value = rotas[LOOP/2];
			*/
			float sum = 0;
			for(int i = 0; i < LOOP; i ++){
				sum += rotas[i];
			}
			value = sum / LOOP;
			status = COMPLETE;
			result = 0;
			continue;
		}

		if(status == COMPLETE){
			rotation(DEFAULT_ROTATION);
			Serial.print("{'type':'measure', 'result':");
			Serial.print(result);
			Serial.print(", 'value':");
			Serial.print(value);
			Serial.print("}\n");
			return;
		}
	}
}

bool Measure::touching()
{
	int r = analogRead(READ_PIN);
	return r > 600;
}

void Measure::rotation(float rotation)
{
	servo.write(180-rotation);
}