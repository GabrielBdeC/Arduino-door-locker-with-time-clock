//http://arduino.esp8266.com/stable/package_esp8266com_index.json
//Include Wifi
#include <WiFi.h>
//Include http
#include <HTTPClient.h>
//Include LCD_I2C
#include <LiquidCrystal_I2C.h>
//Include RFID reader
#include <MFRC522.h>
#include <SPI.h>

//Config RfID
#define SS_PIN 10
#define RST_PIN 9

//Config Button and Locker
#define button 11
#define locker 12
 
//Classes
HTTPClient http;
MFRC522 rfid(SS_PIN, RST_PIN); 
MFRC522::MIFARE_Key key;
LiquidCrystal_I2C lcd(0x27, 20, 04);
hw_timer_t* timer = NULL;


//Variables
String token;
String readString;
size_t safeRepetitionToken = 0;
size_t safeRepetitionUpdateToken = 0;
int signalIntensity = 0;

//Functions
//Wifi Setup
void WifiSetup() {
  WiFi.begin("TDLR", "Thiago2001");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

//Get Request
bool get(String module_url, bool isProtected) {    
    http.begin("http://192.168.3.8:3000/api/door_locker/" + module_url);
    if(isProtected){
        http.addHeader("Authorization", "Bearer " + token);        
    }
    int httpGet = http.GET();
    if(httpGet  == 200){
        String payload = http.getString();
        
        Serial.print("Get Function payload: ");
        Serial.println(payload);
        http.end();
        return true;
    }
    else{            
        Serial.print("Get Function recived code: ");
        Serial.println(httpGet);
        http.end();
        return false;
    }
}

//Get Health
bool getHealth(){
    return get("v1/health_check", false);
}

//Get Protected Health
bool getProHealth(){
    return get("v1/auth/protected_check", true);
}

//Get Token
void getToken(){
    http.begin("http://192.168.3.8:3000/api/door_locker/v1/auth/login");
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
    else{     
        if (getHealth)
        {
            Serial.print("Get Token Function code: ");
            Serial.println(httpPost);
            if (safeRepetitionToken < 5){
                safeRepetitionToken++;
                getToken();
            }
            else{
                Serial.println("Error getting token: Call for assistence");
                safeRepetitionToken = 0;
            }            
        }
        else{
            Serial.println("Server offline");
        }
    }
    http.end();
}

//Checks if RFID is valid on Data Base
void isOnDB(String rfid){
    http.begin("http://192.168.3.8:3000/api/door_locker/v1/locker");
    String bearer = "Bearer ";
    bearer += token;
    http.addHeader("Authorization", "Bearer " + token);
    http.addHeader("Content-Type", "application/json");
    int httpPost = http.POST("{\"rfid\": \"" + readString + "\"}");

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
            digitalWrite(locker, HIGH);
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
    else if (httpPost == 401 && safeRepetitionUpdateToken < 5) //Verificar se o código é 401 depois de espirar
    {
        safeRepetitionUpdateToken++;
        getToken();
        isOnDB(rfid);
    }
    else{
        Serial.print("isOnDB: ");
        Serial.println(httpPost);
        safeRepetitionUpdateToken = 0;
        http.end();

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

//LCD rest
void lcdRest(){
    lcd.clear();
    lcd.setCursor(7,0);
    lcd.print("LabTeC");
    lcd.setCursor(0,2);
    lcd.print("Aproxime seu cartão");
    lcd.setCursor(0,3);
    lcd.print("ao lado do visor");
    timerAlarmDisable(timer);
}

//Start of the program
//Setup
void setup(){
    Serial.begin(115200);    
    WifiSetup();
    getToken();
    pinMode(button, INPUT);
    pinMode(locker, OUTPUT);
    rfid.PCD_Init();
    lcd.init();
    lcd.backlight();
    lcdRest();
    timer = timerBegin(0, 80, true);
    timerAttachInterrupt(timer, &lcdRest, true);
    timerAlarmWrite(timer, 2000000, true);
    timerAlarmDisable(timer);
}

void loop(){
    if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()){
        String cardUID;
        for (size_t i = 0; i < rfid.uid.size; i++)
        {
            cardUID.concat(String(rfid.uid.uidByte[i]));
        }
        isOnDB(cardUID);
    }
}