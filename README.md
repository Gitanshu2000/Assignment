Introduction
This is a web application that uses the Google Translate API to convert farmer details from English to different languages
. The mobile application currently supports 4 languages apart from English: Hindi, Marathi, Telugu and Punjabi.
The farmer is free to use the mobile application in any language that we support.

API Endpoints
1)('/upload')An API which enables users to upload the farmer list via a csv file and translates the data into supported languages.
The csv file should contain the farmer details in English. Once the file is uploaded
, the application will use the Google Translate API to convert the data into the supported languages.

2)('/homepage') An API which allows us to retrieve all farmer data in the subset of languages specified above. 
This endpoint can be used to retrieve the translated data in the languages of choice.

3)('/login')This is a third endpoint of application for authentication of user .The endpoint is HTTP POST Request
that accept form parameter , and then authenticate user with database , as only authenticated user
has the permission to upload the farmers details)

How to Use
Clone the repository
Install the dependencies
Start the server

Make a POST request to the /upload endpoint with the csv file containing the farmer details in English.

Make a GET request to the /homepage endpoint with the desired language code in the query parameters to retrieve the translated data in the specified language.


Note:Make sure you have a valid API key for the Google Translate API to use this application. ( as i didn't provided with repository)

Conclusion
This application allows you to convert farmer details from English to different languages using the Google Translate API.
. The application is designed to be easy to use and can be integrated into any existing system.
