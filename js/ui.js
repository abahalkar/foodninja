const recepies=document.querySelector('.recipes');
document.addEventListener('DOMContentLoaded', function() {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
  // add recipe form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});
});

/**
 * below is renderRecipes() which takes two parameter data and id which get data from db.js while calling
 * inside it we have string with html and inside it we printed our data which is prameter variable
 * then we created const recepies=document.querySelector('.recipes');
 * and append the htmlcard string using innerHTML
 */
const renderRecipes=(data,id)=>{

  const htmlcard=`
  <div class="card-panel recipe white row" data-id=${id}>
    <img src="./img/dish.png" alt="recipe thumb">
    <div class="recipe-details">
      <div class="recipe-title">${data.title}</div>
      <div class="recipe-ingredients">${data.ingredients}</div>
    </div>
    <div class="recipe-delete">
      <i class="material-icons" data-id=${id}>delete_outline</i>
    </div>
  </div>
  `;
  recepies.innerHTML +=htmlcard;

} 


//remove recipe card
//this function have id parameter and having value same as clicked card id
const removeRecipes=(id)=>{
  //we select data-id attribute with value id by serching .recipe class
  const recipe=document.querySelector(`.recipe[data-id=${id}]`);
  recipe.remove();
}