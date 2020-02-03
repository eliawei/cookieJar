# cookieJar
CookieJars goal is to improve ones health by limiting his\her snacks consumption based on the sum of calories he\she has consumed.
The device is a smart vending machine(based on esp8266) which is controlled through a designated Android application(developed in React-Native).
The app and the device communicates through Google Firebase cloud.

Diagram  of the system communication :

<img src="https://user-images.githubusercontent.com/39025262/73687985-cb3c6c80-46d3-11ea-85af-717fac64fde0.jpg" width="400" height="400">


# Work Flow:
# load a snack:
1.	user scans barcode of snack in application and puts the snack in the cart.
2.	data is being imported from “open food facts” DB and saved on the users machine cloud storage.
3.	the machine gets the appropriate slot ready for the snack 
4.	the cart moves to the appropriate slot and releases the snack.

<img src="https://user-images.githubusercontent.com/39025262/73691405-f5ddf380-46da-11ea-9e3b-c6ff06e47741.jpg" width="400" height="400">

# consume a snack:
1.	user chooses desired snack in the app.
2.	app checks if the user exceeded its daily calorie limit.
a.	if no : snack is being released
b.	if yes: request is being denied
3.	data is being updated according to progress.

<img src="https://user-images.githubusercontent.com/39025262/73691436-08582d00-46db-11ea-8322-b9b749f592e1.jpg" width="400" height="400">

# Settings

<img src="https://user-images.githubusercontent.com/39025262/73691473-18700c80-46db-11ea-9eb4-0158269cdc0b.jpg" width="400" height="400">

# device photos

<img src="https://user-images.githubusercontent.com/39025262/73687818-7ef12c80-46d3-11ea-97b4-b18ff5006417.jpeg" width="400" height="400">

<img src="https://user-images.githubusercontent.com/39025262/73687819-7ef12c80-46d3-11ea-97f0-74da64f0578c.jpeg" width="400" height="400">

<img src="https://user-images.githubusercontent.com/39025262/73687820-7ef12c80-46d3-11ea-8baa-280740a80091.jpeg" width="400" height="400">

# Creators
Elia Weizman

Ben Ben Sasson

Uriya Enmar

This project was done on an IOT course in Technion.


