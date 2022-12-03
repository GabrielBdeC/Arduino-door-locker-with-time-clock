//http://arduino.esp8266.com/stable/package_esp8266com_index.json
//Include Wifi
#include <WiFi.h>
//Include http
#include <HTTPClient.h>
//Include LCD_I2C
#include <LiquidCrystal_I2C.h>
//Include RFID reader
#include <MFRC522.h>

//Config RfID ports
#define SS_PIN 32
#define RST_PIN 33

//Config Button and Locker ports
#define button 2
#define locker 4

//Server url
#define URL "http://192.168.3.8:3000/api/door_locker/"
 
//Classes
HTTPClient http;
MFRC522 rfid(SS_PIN, RST_PIN); 
MFRC522::MIFARE_Key key;
LiquidCrystal_I2C lcd(0x27, 20, 04);
hw_timer_t* timer = NULL;


//Variables
String token;
size_t safeRepetitionToken = 0;
size_t safeRepetitionUpdateToken = 0;

//Functions
//Wifi Setup
void wifiSetup() {
  WiFi.begin("TDLR", "Thiago2001");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
    lcd.clear(); 
    lcd.setCursor(3,0);
    lcd.print("WiFi connected");
	delay(1000);
}

//Get Request
bool get(String module_url, bool isProtected) {    
    http.begin(URL + module_url);
    if(isProtected){
        http.addHeader("Authorization", "Bearer " + token);        
    }
    int httpGet = http.GET();
    if(httpGet  == 200){
        http.end();
        return true;
    }
    else{            
        http.end();
        return false;
    }
}

//Get Health
bool getHealth(){
    return get("v1/health_check", false);
}

//Get Protected Health
bool getProtectedHealth(){
    return get("v1/auth/protected_check", true);
}

//Error handler
bool errorHandler(int errorCode, int errorPlace){
	//1-getToken
	//2-isOnBd
	if(errorCode == 401){
        getToken();
    }
	else if(errorCode == 500){	//Server Internal Error
		lcd.clear();
        lcd.setCursor(7,0);
        lcd.print("LabTeC");
        lcd.setCursor(0,1);
        lcd.print("Falha interna");
        lcd.setCursor(0,2);
        lcd.print("no Servidor");
        lcd.setCursor(0,3);
        lcd.print("Servidor");
	}
	else if(errorCode == 400){
		//Bad request -> Algo errado porra
	}
	else if(errorCode < 0){	//Server not reached
		
		lcd.clear();
        lcd.setCursor(7,0);
        lcd.print("LabTeC");
        lcd.setCursor(0,1);
        lcd.print("Falha ao conectar");
        lcd.setCursor(0,2);
        lcd.print("com o");
        lcd.setCursor(0,3);
        lcd.print("Servidor");
	}
}

//Get Token
void getToken(){
    http.begin(String(URL) + "v1/auth/login");
    http.addHeader("Content-Type", "application/json");
    int httpPost = http.POST("{\"login\": \"arduino\", \"password\": \"Ra!63NW4^R67\"}");
    if(httpPost  == 201){
        String payload = http.getString();
        int index1 = payload.indexOf("\"accessToken\":\"")+15;
        payload.remove(0, index1);
        int index2 = payload.indexOf("\"");
        payload.remove(index2, payload.length());
        token = payload;
        safeRepetitionToken = 0;
    }
    else {
		errorHandler(httpPost, 1);
	}	
    http.end();
}

//Checks if RFID is valid on Data Base
void isOnDd(String rfid){
    http.begin(String(URL) + "/v1/locker");
    String bearer = "Bearer ";
    bearer += token;
    http.addHeader("Authorization", "Bearer " + token);
    http.addHeader("Content-Type", "application/json");
    int httpPost = http.POST("{\"rfid\": \"" + rfid + "\"}");

    if(httpPost  == 200){
        safeRepetitionUpdateToken = 0;
        String payload = http.getString();
        http.end();
        
        if (payload == "OK")
        {
            lcd.clear();
            lcd.setCursor(7,0);
            lcd.print("LabTeC");
            lcd.setCursor(0,2);
            lcd.print("Cartão enviado");
            lcd.setCursor(0,3);
            lcd.print("para cadastro");
            timerRestart(timer);
        }
        else{
            lcd.clear();
            lcd.setCursor(7,0);
            lcd.print("LabTeC");
            lcd.setCursor(0,2);
            lcd.print("Bem vindo(a)");
            int index1 = payload.indexOf("\"name\":\"")+8;
            payload.remove(0, index1);
            int index2 = payload.indexOf("\"");
            payload.remove(index2, payload.length());
            if(payload.length()>20){
                for (int i=0; i < 20; i++) {
                    payload = " " + payload;  
                } 
                payload = payload + " "; 
                for (int pos = 0; pos < payload.length(); pos++) {
                    lcd.setCursor(0, 3);
                    lcd.print(payload.substring(pos, pos + 20));
                    delay(500);
                }
            }
            else{
                lcd.setCursor(0,3);
                lcd.print(payload);
            } 
            timerRestart(timer);
            digitalWrite(locker, HIGH);
            delay(100);
            digitalWrite(locker, LOW);
        }   
    }
    else if (httpPost == 404)
    {
        lcd.clear();
        lcd.setCursor(7,0);
        lcd.print("LabTeC");
        lcd.setCursor(0,1);
        lcd.print("Falha na leitua");
        lcd.setCursor(0,2);
        lcd.print("ou");
        lcd.setCursor(0,3);
        lcd.print("Não cadastrado");
    }
    else{
		if(errorHandler(httpPost, 2)){
			isOnDd(rfid);
		}
		http.end();
	}
}

//LCD reset
void lcdReset(){
    lcd.clear();
    lcd.setCursor(7,0);
    lcd.print("LabTeC");
    lcd.setCursor(0,2);
    lcd.print("Aproxime seu cartão");
    lcd.setCursor(0,3);
    lcd.print("ao lado do visor");
    timerStop(timer);
}

//Start of the program
//Setup
void setup(){
    // Serial.begin(115200);    
    wifiSetup();
    getToken();
    pinMode(button, INPUT);
    pinMode(locker, OUTPUT);
    rfid.PCD_Init();
    lcd.init();
    lcd.backlight();
    lcdReset();
    timer = timerBegin(0, 80, true);                // timer 0, MWDT clock period = 12.5 ns * TIMGn_Tx_WDT_CLK_PRESCALE -> 12.5 ns * 80 -> 1000 ns = 1 us, countUp
    timerAttachInterrupt(timer, &lcdReset, true);   // edge (not level) triggered 
    timerAlarmWrite(timer, 5000000, true);          // 1000000 * 1 us = 1 s, autoreload true
    timerAlarmEnable(timer);                        // enable
    timerStop(timer);
}

void loop(){
    if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()){
        String cardUID;
        for (size_t i = 0; i < rfid.uid.size; i++)
        {
            cardUID.concat(String(rfid.uid.uidByte[i] < 0x10 ? "0" : ""));
            cardUID.concat(String(rfid.uid.uidByte[i], HEX));
        }
        isOnDd(cardUID);
    }
}