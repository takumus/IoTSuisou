#include "measure.h"

Measure::Measure()
{
	
}
void Measure::init(int readPIN, int servoPIN)
{
	_readPIN = readPIN;
	servo.attach(servoPIN, 731, 2575, 180);
	servo.power(false);	
	rotate(DEFAULT_ROTATION);
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
	float diff = 0;
	Status status = WASH;
	servo.power(true);
	while(true){
		//Serial.print("status:");
		//Serial.println(status);
		if(status == WASH){
			rota = DEFAULT_ROTATION;
			while(true){
				if(touching()) {
					delay(WASH_TIME);
					status = BACK;
					break;
				}
				//水面が無い
				if(rota > MAX_ROTATION){
					result = 1;
					status = COMPLETE;
					break;
				}
				rotate(rota);
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
				rotate(rota);
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
			rotate(rota);
			delay(BACK_TIME);
			status = BEGIN;
			/*
			while(true){
				if(backRota > rota){
					status = BEGIN;
					break;
				}
				rotate(rota);
				rota -= SEARCH_ROTATION_SPEED;
			}
			*/
			continue;
		}
		if(status == CALC){
			rotate(DEFAULT_ROTATION);
			///*
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
			diff = rotas[LOOP-1] - rotas[0];
			//value = rotas[LOOP/2];
			//*/
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
			rotate(DEFAULT_ROTATION);
			Serial.print("{\"type\":\"measure\"");
			Serial.print(", \"result\":");
			Serial.print(result);
			Serial.print(", \"value\":");
			Serial.print(value, 3);
			Serial.print(", \"diff\":");
			Serial.print(diff);
			Serial.print("}\n");
			break;
		}
	}
	delay(TO_HOME_TIME);
	servo.power(false);
}

bool Measure::touching()
{
	int r = analogRead(_readPIN);
	return r > 600;
}

void Measure::rotate(float value)
{
	servo.write(180-value);
}