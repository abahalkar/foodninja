if('serviceWorker' in navigator){
/* 
* this inside code only run when service worker is support by browser
* register the service worker using navigator object,service worker property 
* and register function. in which pass file and it's path.
* this is asychronous jobs so may take time to run/complete hence run using promise
* if promise run succefully then() is excute if fail then cach is run
* when successful return reg object while on fail return err object
* we print message using arrow function.
*/
navigator.serviceWorker.register('sw.js')
.then((reg)=>console.log("service worker registered", reg))
.catch((err)=>console.log("service worker not registered", err));
}
