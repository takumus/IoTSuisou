void setup(){
  //モニタリングのためシリアル通信開始
  Serial.begin(9600);
  //8番ピンをデジタル出力
  pinMode(12,OUTPUT);
  //9番ピンをデジタル入力
  pinMode(11,INPUT);
  
}
int c = 0;
unsigned long pt, nt;
bool touch = false;
int pr = 0;
void loop(){
  int nr = analogRead(0);
  //Serial.println(r);
  int dr = nr - pr;
  dr *= dr<0?-1:1;
  Serial.println(dr);
  if(dr > 50) {
    nt = micros();
    if(pt + 40000 < nt){
      touch = true;
    }
    pt = nt;
  }else{
    nt = micros();
    if(pt + 40000 < nt){
      if(touch) {
        touch = false;
      }
    }
  }
  digitalWrite(12, touch?HIGH:LOW);
}

