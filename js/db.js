//we added this top for prevent enablePersistence error
//offline database, this enables IndexedDB
db.enablePersistence()
 .catch(err=>{
     if(err.code=='failed.precondition'){
         //may be multiple tabs open
         console.log('persistance Failed');
     }else if(err.code=='unimplemented'){
         console.log('persistance is not available');
     }
 });

/** Real Time linstner
 * A real time listner check with database time to time for changes and record that changes
 * collection is method is connected with database collection we pass collection name as argument
 * then we use onSnapshot() which take snapshot of db on changes and this onSnapshot() takes callbak function and snapshot object as argument
 * now we print array of doc changes object using docChanges() method, current both two objects are added type we add and remove one recipes document inside recipe collection for demo add and remove type, note check without refresh/reload page
 * now access each change doc object from array to acces data using snapshot object and foreach()
 * change object has doc property and doc property has data property which we access using data() on doc object
 * print or access individual data feild we can print using it's name 
*/
db.collection('Recipes').onSnapshot((snapshot)=>{
    //console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(change => {
        //seprate the change object from array of object
        //console.log(change);
        //console.log(change.doc.data());
        //console.log(change.doc.id, change.doc.data().title);
        if(change.type==='added'){
            //add recepies card on data added,
            //this is call of renderRecipes() wjich take two arguments data and id            
            renderRecipes(change.doc.data(),change.doc.id);
        }
        if(change.type==='removed'){
            //remove card
            removeRecipes(change.doc.id);
        }

    });
})



 //add recipes to using form to listing and database record
 const formSelector=document.querySelector('form');
 
 formSelector.addEventListener('submit',evt=>{
     evt.preventDefault();

     const recipe={
         title:formSelector.title.value,
         ingredients:formSelector.ingredients.value
     };

    db.collection('Recipes').add(recipe)
    .catch(err=>console.log(err));
    
    formSelector.title.value='';
    formSelector.ingredients.value='';
 });

 //delete Recipe
 /**
  * We slect .recipes class of whole container of recipe card
  * 
  */
 const recipeContainer=document.querySelector('.recipes');
 recipeContainer.addEventListener('click',evt=>{
     //console.log(evt);
    //in if check where only i stand for icon tag being clicked using target.tagName
     if(evt.target.tagName==='I'){
        //we collect click recipe id using target.getAttribute('data-id') and pass data-id tag attribute
        const id=evt.target.getAttribute('data-id');
        //finally we delete document using delete method and id as argument from Recipes collection
         db.collection('Recipes').doc(id).delete();
     }
 })