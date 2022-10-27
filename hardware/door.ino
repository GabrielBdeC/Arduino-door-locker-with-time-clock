#include <WiFi.h>
#include <HTTPClient.h>

//Variables
HTTPClient http;
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
String isOnDB(String rfid){
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
        return payload;
    }
    else if (httpPost == 401 && safeRepetitionUpdateToken < 5) //Verificar se o código é 401 depois de espirar
    {
        safeRepetitionUpdateToken++;
        getToken();
        return isOnDB(rfid);
    }
    else{
        Serial.print("isOnDB: ");
        Serial.println(httpPost);
        safeRepetitionUpdateToken = 0;
        http.end();
        return "";
    } 
}

//Start of the program
//Setup
void setup(){
    Serial.begin(115200);    
    WifiSetup();
    getToken();
}

bool readSerial = false;
void loop(){
    if (Serial.available()){
        char c = Serial.read();  //gets one byte from serial buffer
        if (c == '\n'||c=='\r') {
            //do stuff
            // Serial.println(readString); //prints string to serial port out            
            readSerial = true;
        }  
        else {     
            readString += c; //makes the string readString
        }
    }
    if(readSerial){
        unsigned long start_timer = micros();
        String teste = isOnDB(readString);
        unsigned long end_timer = micros();

        Serial.println(teste);

        if(teste.length()>0){
            Serial.println("Dor unlocked");            
        }        
        else{
            Serial.println("Acsess Denied");
        }
        Serial.print(F("Time to transmit = "));
        Serial.println(end_timer - start_timer);

        readString=""; //clears variable for new input
        readSerial = false;
    }
}