#!/usr/bin/python
# coding: utf-8

# モジュールをインポートする
import wiringpi as wpi
import time, threading

# GPIO指定をGPIO番号で行う
wpi.wiringPiSetupGpio();

# GPIO18ピンを入力モードに設定
wpi.pinMode(15, wpi.OUTPUT);
wpi.pinMode(18, wpi.INPUT);
count = 0;

def thread1():
	while True:
		global count;
		#while wpi.digitalRead(18) == wpi.LOW:
		#	pass;
		count += 1;
		print(wpi.digitalRead(18))

def thread2():
	while True:
		global count
		time.sleep(0.1);
		#print(count);
		count = 0;

_thread1 = threading.Thread(target=thread1);
_thread2 = threading.Thread(target=thread2);
_thread1.start();
_thread2.start();

while True:
	pass;
# GPIOピンをリセット
