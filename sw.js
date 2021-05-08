//install service worker
/*
* selft represent service worker itself then we add event listener function
* we listen install event hence use install and use call back function to react on listing
* evt object represnt install event
* as we know install event run only once on pae refresh servie worker re-register but not reinstall
* it's only reinstall when there is change in service worker file.
* on refresh page new activation in waiting it's only activate wen all tab cloase and broswer and reopen app
*/
//caceh name
const staticCacheName='site-statics-v5';
const dynamicCacheName='site-dynamic-v5';
//in asset we pass many string and each string represt resouces/asset which we want cache
const assets=[
    '/',
    '/index.html',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/js/materialize.min.js',
    '/js/ui.js',
    '/js/app.js',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v85/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/pages/fallback.html'
    
];
self.addEventListener("install",(evt)=>{
    console.log("Service worker installed",evt);
    /** here we cache assest
     * caches is cache api and open is function in which we need to pass name of cache string but we pass variable and store cache name in variable
     * here its open cache if exit or create new one if present in browser 
     * and its retun the promise, we use then and use cache parameter and open cache in callback function
     * here we use add or addall function both take resouces from server and store in cache. add() get single asset while addAll() get list of resouces which we pass in list of array 
     * the service worker is run ansynchronus hence we added eaitUntil() on evt till the cache process is complete
    */
    evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
        console.log("Assets are cache");
        cache.addAll(assets);
        
    })
   );
   

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

self.addEventListener("activate", (evt)=>{
    console.log("Service worker has been ativated",evt);
    /**
     * we updated cache name from site-statics to site-statics-v1
     * Now we have two version of cache old and new v1 but still our fetch request not sure use which cache version
     * fetch request still return old cache version hence we need to dlete old cache and activate new cache version
     * now we changed in service worker file and it created and activated new service worker for changes hence we gonna dlete old service worker here and linkk to fetch request wih new cache version
     * so it's intercept the new fetch request and response new version.
     * we use waituntill() because it's asynchronus method hence till complete the process
     * we use caches.keys which returns the all caches keys in promise,
     * we retuen promise.all() taking array of promises and pass keys array sand apply filter method and compair the cache key name which does not match with variable current value cache name
     * then we use .map() method to mapping array to promises and delete that filtered key using caches.delete(key) and pass key name as parameter
     */
    //delte old cache
    evt.waitUntil(
        caches.keys().then(keys => {
            //console.log(keys);
            return Promise.all(keys
              .filter(key => key!== staticCacheName && key!== dynamicCacheName)
              .map(key=>caches.delete(key))  
            )
        })
    )
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
    //console.log("Fetch Listner Requested",evt );
/**here we check there is no firebase api not in request then only store cache code block run */
if(evt.request.url.indexOf('firebase.googleapis.com')=== -1){

/* Geeting stored cache and retun to browser when offline
* for this we use respondWith() which pause the fetch event and respose our custom respose from cache
* inside respodeWith we check stored cache with requested event using match()
* which return the promise and in callback function will return the response cache
* the response cache either match stored cache cacheReq or null, we cant return null 
* hence we return actual fetch request respose fetch(evt.request) i.e.live server fetch asset response
*even after we make app online still it's take asset from cache by service worker
* we also fix font issue by adding in cache which we miss url in css https://fonts.gstatic.com/s/materialicons/v85/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2
*/
 evt.respondWith(
     caches.match(evt.request).then(cacheRes => {
         //return cacheRes || fetch(evt.request);
         //dynamic cache const dynamicCacheName=site-dynamic-v1
         /**
          * we intercept fetch request and check do we have cache for request fetch event, if yes then return cache asset elase
          * pass request to server for respose. 
          * now we intercept that server respose and store that response in new dynamic cache
          * so continue with then(fetchReq=>) we use then promise on fetch(evt.request).
          * inside respose we open new cache "dynamic cache and" clone fetch server respose in dynamic cache using put()
          * we clone and then put andreturn original fetchreq as page resonse for page loading
          */
         return cacheRes || fetch(evt.request).then(fetchReq=>{
             return caches.open(dynamicCacheName).then(cache=>{
                 cache.put(evt.request.url, fetchReq.clone());
                 //call and check the limiting cache size
                 limitCacheSize(dynamicCacheName,15);
                 return fetchReq;
             })
             /** call fallback page
              * this catch will excute when fetch request fail to find response in static cache, dynamic cache and get respose from server
              * when all above condtions fails then callback function excute. specially on offline mode when user tried to access page and unable to get it
              * now we gonna check the request should be html page current version fallback page return also when some one request image and that not in cache
              * so we add condition to check retun fallon on html page only
              * we check page url in using indexof() and it greter than -1 then only we return the fallback page
             */
         }).catch(()=>{
             if(evt.request.url.indexOf('.html')>-1)
           return  caches.match('/pages/fallback.html')
         });

    })
 )
}
});

//Limiting the cache
/**
 * we creaed varible limitCacheSize with arrow function and pass 2 parameter 
 * first one is name of cache who being limit and second parameter for limit size cache
 * then in promise we open cache and pass cache check all cache keys
 * cache.keys in this keys are nothing but asset in cache means page url like index.html,app.js all these are keys in cache
 * then in promise we pass keys and check keys array length with if()
 * when it's exceed then we delete the first key of keys and then again check cache size using recurssion function
 * the next major question where to call this function
 * we call it inside fetch event after the clone the cache asset in dynamic cache.
 * 
 */
const limitCacheSize=(cacheName, size)=>{
    caches.open(cacheName).then(cache =>{
        cache.keys().then(keys=>{
            if(keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(cacheName, size));
            }
        })
    })
};