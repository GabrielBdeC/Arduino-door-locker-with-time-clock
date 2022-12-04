//http://arduino.esp8266.com/stable/package_esp8266com_index.json
//Include Wifi
#include <WiFi.h>
//Include http
#include <HTTPClient.h>
//Include LCD_I2C
#include <LiquidCrystal_I2C.h>
//Include RFID reader
#include <MFRC522.h>

//Server url
#define URL "http://192.168.3.8:3000/api/door_locker/"

//Config RfID ports
#define SS_PIN 32
#define RST_PIN 33

//Config Button and Locker ports
#define button 2
#define locker 4

//Classes
HTTPClient http;
MFRC522 rfid(SS_PIN, RST_PIN); 
MFRC522::MIFARE_Key key;
LiquidCrystal_I2C lcd(0x27, 20, 04);
hw_timer_t* refreshTimer = NULL;
hw_timer_t* reconnectTimer = NULL;
int reconnectTimerTime = 1000000;


//Variables
String token;
size_t safeRepetition = 0;



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
	if(errorCode == 401 && safeRepetition < 5){
        safeRepetition++;
		getToken();
		return true;
    }
	else if(errorCode == 500){	//Server Internal Error
		lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("Erro: 500");
        lcd.setCursor(0,1);
        lcd.print("Erro Interno");
        lcd.setCursor(0,2);
        lcd.print("no Servidor");
	}
	else if(errorCode == 400){	//Bad request -> Algo errado porra
		lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("Erro: 400");
        lcd.setCursor(0,1);
        lcd.print("Requesição Ruim");
        lcd.setCursor(0,2);
		if(errorPlace = 1){
        	lcd.print("Local: Login");
		}
		else if(errorPlace == 2){
			lcd.print("Local: Autenticação");
		}
	}
	else if(errorCode < 0){	//Server not reached
		
		lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("Erro: -1");
        lcd.setCursor(0,1);
        lcd.print("Não foi possivel");
        lcd.setCursor(0,2);
        lcd.print("acessar o servidor");
	}

	timerAlarmWrite(reconnectTimer, reconnectTimerTime, false);
	timerStart(reconnectTimer);
	lcd.setCursor(0,3);
	int timeLeft;
	while(timerStarted(reconnectTimer)){
        timeLeft = reconnectTimerTime-timerRead(reconnectTimer);
        if (timeLeft > 1000000)
        {
           lcd.print("Reconetando em: " + String(timeLeft/1000000) + "s");
        }
        else{
           lcd.print("Reconetando em: " + String(timeLeft/1000) + "ms");
        }
	}

    if (reconnectTimerTime < 30000000)
	{
		reconnectTimerTime += 1000000;		
	}
	getToken();
	return false;
}

//Reconect
void IRAM_ATTR reconect(){
	timerStop(reconnectTimer);
	timerRestart(reconnectTimer);
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
        safeRepetition = 0;
    }
    else {
		errorHandler(httpPost, 1);
	}	
    http.end();
}

//Checks if RFID is valid on Data Base
void isOnDb(String rfidTag){
    http.begin(String(URL) + "v1/locker");
    String bearer = "Bearer ";
    bearer += token;
    http.addHeader("Authorization", "Bearer " + token);
    http.addHeader("Content-Type", "application/json");
    int httpPost = http.POST("{\"rfid\": \"" + rfidTag + "\"}");

    if(httpPost  == 200){
        safeRepetition = 0;
        String payload = http.getString();
        
        if (payload == "STORED")
        {
            lcd.clear();
            lcd.setCursor(7,0);
            lcd.print("LabTeC");
            lcd.setCursor(0,2);
            lcd.print("Cartão enviado");
            lcd.setCursor(0,3);
            lcd.print("para cadastro");
            timerRestart(refreshTimer);
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
			isOnDb(rfidTag);
		}
	}
	http.end();
	timerRestart(refreshTimer);
    timerStart(refreshTimer);
}

//LCD reset
void IRAM_ATTR lcdReset(){
    lcd.clear();
    lcd.setCursor(7,0);
    lcd.print("LabTeC");
    lcd.setCursor(0,2);
    lcd.print("Aproxime seu cartão");
    lcd.setCursor(0,3);
    lcd.print("ao lado do visor");
    timerStop(refreshTimer);
}

//Start of the program
//Setup
void setup(){
    refreshTimer = timerBegin(0, 80, true);                		// timer 0, MWDT clock period = 12.5 ns * TIMGn_Tx_WDT_CLK_PRESCALE -> 12.5 ns * 80 -> 1000 ns = 1 us, countUp
    timerAttachInterrupt(refreshTimer, &lcdReset, true);   		// edge (not level) triggered 
    timerAlarmWrite(refreshTimer, 5000000, true);          	// 1000000 * 1 us = 1 s, autoreload true
    timerAlarmEnable(refreshTimer);                        		// enable
    timerStop(refreshTimer);

    reconnectTimer = timerBegin(1, 80, true);                	// timer 0, MWDT clock period = 12.5 ns * TIMGn_Tx_WDT_CLK_PRESCALE -> 12.5 ns * 80 -> 1000 ns = 1 us, countUp
    timerAttachInterrupt(reconnectTimer, &reconect, true);   	// edge (not level) triggered 
    timerAlarmWrite(reconnectTimer, reconnectTimerTime, false);  // 1000000 * 1 us = 1 s, autoreload true
    timerAlarmEnable(reconnectTimer);                        	// enable
    timerStop(reconnectTimer);

    // Serial.begin(115200);    
    wifiSetup();

    getToken();

    pinMode(button, INPUT);
    pinMode(locker, OUTPUT);

    rfid.PCD_Init();

    lcd.init();
    lcd.backlight();
    lcdReset();
}

void loop(){
	reconnectTimerTime = 0;
    if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()){
        String cardUID;
        for (size_t i = 0; i < rfid.uid.size; i++)
        {
            cardUID.concat(String(rfid.uid.uidByte[i] < 0x10 ? "0" : ""));
            cardUID.concat(String(rfid.uid.uidByte[i], HEX));
        }
        isOnDb(cardUID);
    }
}