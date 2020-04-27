/*  This sketches accesses the ITP Weather Station's database,
 *  gets weather data for selected dates,
 *  and parses the data to save them into variables.
 *  
 *  You'll need to know the weather station's mac addrss and session key 
 *  to access the database.
 *
 *  April 2020
 *  
 *  This example sketch is put together by Yeseul Song for the ITP Weather Band,
 *  based on Tom Igoe's Connected Devices example.
 *  Thanks: Arnab Chakravarty.
*/

#include <ArduinoJson.h>
#include <ArduinoHttpClient.h>
#include <WiFiNINA.h> // you might want to use WiFi101.h instead depending on which arduino you're using

#include "arduino_secrets.h" 
      
char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;
String mac_identity = MAC_ID;
String session_identity = SESSION_KEY;

const char serverAddress[] = "tigoe.io";  // server address
int port = 443;  // for https

WiFiSSLClient wifi;
HttpClient client = HttpClient(wifi, serverAddress, port);
int status = WL_IDLE_STATUS;

void setup() {

  Serial.begin(9600);
  while (!Serial);
  while ( status != WL_CONNECTED) {
    Serial.print("Attempting to connect to Network named: ");
    Serial.println(ssid);     // print the network name (SSID);

    // connect to WPA/WPA2 network:
    status = WiFi.begin(ssid, pass);
  }

  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
  
}

void loop() {  

  // get data from the database
  getData();

  // read the status code and body of the response
  int statusCode = client.responseStatusCode();
  String response = client.responseBody();

  Serial.print("Status code: ");
  Serial.println(statusCode);
  Serial.print("Response: ");
  Serial.println(response);

  // belos is to parse the response using the ArduinoJson library

  // remove the '[', ']' and extra white spaces from the response for parsing
  response = response.substring(3, response.length()-2);  

  // set the capacity of the memory pool in bytes
  DynamicJsonDocument doc(500);

  // deserialize the JSON document
  DeserializationError error = deserializeJson(doc, response);

  // test if parsing suceeds
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    return;
  }

  // extract data and assign them to each variable
  const char* recorded_at = doc["recorded_at"];
  int wind_dir = doc["wind_dir"];  
  int windddir_avg2m = doc["winddir_avg2m"];
  float windspeedmph = doc["windspeedmph"];
  float windgustdir_10m = doc["windgustdir_10m"];
  float windgustmph_10m = doc["windgustmph_10m"];
  float rainin = doc["rainin"];
  float dailyrainin = doc["dailyrainin"];
  float rain_avg1m = doc["rain_avg1m"];
  float rain_avg10m = doc["rain_avg10m"];
  float temperature = doc["temperature"];
  float humidity = doc["humidity"];
  float pressure = doc["pressure"];
  float illuminance = doc["illuminance"];
  float uva = doc["uva"];  
  float uvb = doc["uvb"];
  float uvindex = doc["uvindex"];

  // Print values
  Serial.print("recorded_at: ");
  Serial.println(recorded_at);
  Serial.print("wind_dir: ");
  Serial.println(wind_dir);
  Serial.print("windddir_avg2m: ");
  Serial.println(windddir_avg2m);
  Serial.print("windspeedmph: ");
  Serial.println(windspeedmph);
  Serial.print("windgustdir_10m: ");
  Serial.println(windgustdir_10m);
  Serial.print("windgustmph_10m: ");
  Serial.println(windgustmph_10m);
  Serial.print("rainin: ");
  Serial.println(rainin);
  Serial.print("dailyrainin: ");
  Serial.println(dailyrainin);
  Serial.print("rain_avg1m: ");
  Serial.println(rain_avg1m);
  Serial.print("rain_avg10m: ");
  Serial.println(rain_avg10m);
  Serial.print("temperature: ");
  Serial.println(temperature);
  Serial.print("humidity: ");
  Serial.println(humidity);
  Serial.print("pressure: ");
  Serial.println(pressure);
  Serial.print("illuminance: ");
  Serial.println(illuminance);
  Serial.print("uva: ");
  Serial.println(uva);
  Serial.print("uvb: ");
  Serial.println(uvb);
  Serial.println("uvindex: ");
  Serial.println(uvindex);
  
  delay(10000);
}

void getData() {
  
  // set path and content type
  String path = "/itpower-data/by-time";
  String contentType = "application/json";

  // set the date/time range. Get only 1-2 at a time, otherwise, the memory can't deal with it.
  String dateFrom = "4-27-2020 20:00:00";
  String dateTo = "4-27-2020 20:10:00";
  
  // assemble the query
  String mac = "\"macAddress\":\"" + mac_identity + "\"";
  String session = "\"sessionKey\":" + session_identity + "";
  String dFrom = "\"dateFrom\":\"" + dateFrom + "\"";
  String dTo = "\"dateTo\":\"" + dateTo + "\"";  

  //combining GET request data as a JSON string object
  String getBody = "{" + mac + "," + session + "," + dFrom + "," + dTo + "}";

  Serial.println(path);
  Serial.println(getBody);
  
  // make the request:
  client.beginRequest();
  client.get(path);
  client.sendHeader("Content-Type", "application/json");
  client.sendHeader("Content-Length", getBody.length());
  client.beginBody();
  client.print(getBody);
  client.endRequest();
  
}
