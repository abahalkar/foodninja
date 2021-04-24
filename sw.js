//install service worker
/*
* selft represent service worker itself then we add event listener function
* we listen install event hence use install and use call back function to react on listing
* evt object represnt install event
* as we know install event run only once on pae refresh servie worker re-register but not reinstall
* it's only reinstall when there is change in service worker file.
* on refresh page new activation in waiting it's only activate wen all tab cloase and broswer and reopen app
*/
self.addEventListener("install",(evt)=>{
    console.log("Service worker installed");
});

//activate servvice worker
/*
* After installation service worker activate by browser and relase activate event
* here we gonna listen activte event and take action in callback function
* Even after SW reinstall it's not ativate immediate it's in waiting stage even after refresh page
* we need to close all bowser tab and reopen app then service worker activate.
* the another way is click on skip link or there is option "Update on reload" in service worker in application tab of browser. 
* for developemnt we use this tab checked
*/

self.addEventListener("activate",(evt)=>{
    console.log("Service worker has been ativated",evt);
});

//listen Fetch Event
/* 
* when we request any page then we actually fire fetch, the all html , css, images or est asset are fetch from server
* we fetch from serve and server give response to fetch request
* when broswer fetch request then our service worker work in bakground 
* and listening fetch request from browser/app.
* the our service worker act as proxy between our app and server
* when app request server for any asset then it's go through our service worker
* that time fetch event is emited. 
* SW intercept our fetch request. its can modify, stop fetch request and return custom respose to app
* intersept is becuase the service worker handles cache and if its already has cache file 
* then respose goes through cache file not from server, by this quick response and offline work
*/
self.addEventListener("fetch",(evt)=>{
    console.log("Fetch Listner Requested",evt );
});