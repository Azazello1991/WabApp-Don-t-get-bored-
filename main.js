const flexBlock = document.querySelector('.flex');
const getActivityBtn = document.querySelector('.js_getActivity');
const getLoadingBtn = document.querySelector('.js_loading');
const errorCard = document.querySelector('.error-card-text');
const activityCard = document.querySelector('.activity-card');
const activityText = document.querySelector('.activity-text');
const translatedText = document.querySelector('.translated-text');
const loadingImages= document.querySelector('.js_loadingImages');
const getImages= document.querySelector('.js_getImages');
const addToList= document.querySelector('.js_addToList');
const images = document.querySelector('.images');
const actyvityList = document.querySelector('.activity-list');

// Acrivity:
let newURLActivity = `http://www.boredapi.com/api/activity?participants=1`;
let participants = 1;
let type = '';
let data = {};
let arrImgURL = [];

// ============================= events =============================== //
flexBlock.addEventListener('click', (e) => {
   const target = e.target;
   
   if (target.name === "participants") {
      participants = target.value;
      criateURL(participants, type, target);

   } else if (target.name === "type") {
      if (target.value !== 'all') {
         type = target.value;
      }
      criateURL(participants, type, target);

   } else if (target.classList.contains('js_getActivity')) {
      images.innerHTML = '';
      activityContent.classList.remove('hidden');
      
      if (actyvityList.children.length > 0) {
         showLeftSide();
      }
      getImages.classList.remove('hidden');
      showLoadingBtn(getLoadingBtn, getActivityBtn);
      createCardActivity();

   } else if (target.classList.contains('translate-btn')) {
      addTranslate(activityText.textContent, 'en', 'uk');

   } else if (target.classList.contains('js_getImages')) {
      addToList.setAttribute('disabled', '');
      getURLphoto(activityText.textContent);
      showLoadingBtn(loadingImages, getImages);

   } else if (target.classList.contains('js_addToList')) {
      showRightSide(); 
      createMyList();
      createActivityByFilter();

   } else if (target.classList.contains('action-remove')) {
      removeActivity(target);
      
   } else if (target.classList.contains('js_filterByParticipants')) {
      createObjForSearch(target);
      creatFilterItem();
      createActivityByFilter();

   } else if (target.classList.contains('js_filterByType')) {
      createObjForSearch(target);
      creatFilterItem();
      createActivityByFilter();

   } else if (target.classList.contains('icon-remove')) {
      removeFilter(target);

   } else if (target.classList.contains('action-translate')) {
      showTextTranslate(target);
   };
});

// event blur:
const search = document.querySelector('.search__input');
search.addEventListener('blur', (e) => {
   const target = e.target;
   createObjForSearch(target);
   creatFilterItem();
   createActivityByFilter();
});


// event chenge:
search.addEventListener('input', (e) => {
   const target = e.target;
   searchActivity(target);
});



// ============================= functions =========================== //

function criateURL(participants, type, target) {
   if (type === '' || target.value==='all') { 
      newURLActivity = `http://www.boredapi.com/api/activity?participants=${participants}`;
   } else {
      newURLActivity = `http://www.boredapi.com/api/activity?participants=${participants}&type=${type}`;
   }
}


// creating fetch Activity:
async function getActivity() {
   try {
      const response = await fetch(newURLActivity); // Получаємо проміс з даними

      if (!response.ok) { // якщо в промісі помилка, то створюємо помилку
         throw new Error("Помилка в запиті");
      }
      const data = await response.json(); // Перетворюємо проміс з даними в об'єкт з даними
      return data; // Повертаємо об'єкт з даними

   } catch (error) { // Ловимо помилку
      console.error(error.message); // Виводимо помилку
   };
};


// creating card Activity:
async function createCardActivity() {

   data = await getActivity();

   if (data !== undefined && (!data.error)) {
      showLoadingBtn(getLoadingBtn, getActivityBtn);
      activityCard.classList.add('show');
      activityText.textContent = data.activity
      translatedText.textContent = '';
      translatedText.classList.add('hidden');
      return data;

   } else {
      showLoadingBtn(getLoadingBtn, getActivityBtn);
      activityCard.classList.remove('show');
      showErrorMessage('Нажаль такої конфігурації не виявлено. Спробуйте іншу.');
   };
};


// add / remove class 'hidden' in buttons:
function showLoadingBtn(btn1, btn2) {
   btn1.classList.toggle('hidden');
   btn2.classList.toggle('hidden');
};



// show/hidden error message:
function showErrorMessage(text) {
   errorCard.parentElement.classList.remove('hidden');
   errorCard.textContent = text;

   setTimeout(()=> errorCard.parentElement.classList.add('hidden'), 2000);
};


// Translating text:
async function translateText(text, sourceLg, translLg) {
   const translateUrl = 'https://translate-plus.p.rapidapi.com/translate';

   const translateText = {
      text: `${text}`,
      source: `${sourceLg}`,
      target: `${translLg}`
   };

   const options = {
      method: 'POST',
      headers: {
         'content-type': 'application/json',
         'X-RapidAPI-Key': '097061fa12mshb5b85664d0a61d7p1590a1jsn1ce65ba8e9d7',
         'X-RapidAPI-Host': 'translate-plus.p.rapidapi.com'
      },
      body: JSON.stringify(translateText)
   };

   try {
      const response = await fetch(translateUrl, options);

      if (!response.ok) { 
         throw new Error("Помилка в запиті");
      };

      const result = await response.json(); 
      return result; 

   } catch (error) { 
      console.error(error.message); 
   };
};

async function addTranslate(text, sourceLg, translLg) {
   const data = await translateText(text, sourceLg, translLg);

   if (data !== undefined && (!data.error)) {
      translatedText.textContent = data.translations.translation;
      translatedText.classList.remove('hidden');
   };
};


// Get array images of activity:
async function getImgOfActivity(text) {
   const urlSearchImg = `https://image-search19.p.rapidapi.com/v2/?q=${text}=en`;
   const optionsSearchImg = {
      method: 'GET',
      headers: {
         'X-RapidAPI-Key': '097061fa12mshb5b85664d0a61d7p1590a1jsn1ce65ba8e9d7',
         'X-RapidAPI-Host': 'image-search19.p.rapidapi.com'
      }
   };
   
   try {
      const response = await fetch(urlSearchImg, optionsSearchImg);

      if (!response.ok) { 
         throw new Error("Помилка в запиті");
      }

      const result = await response.json();

      return result;

   } catch (error) {
      console.error(error.message);
   };
};


// Createing Array URL photo:
async function getURLphoto(text) {
   const data = await getImgOfActivity(text);
   const imagesArr = [];
   const images = data.response.images;

   images.forEach(item => {
      imagesArr.push(item.thumbnail.url)
   });

   checkURL(imagesArr);
   return imagesArr
};


// Checking array URL:
async function checkURL(urlArray) {
   showLoadingBtn(loadingImages, getImages); // remove
   getImages.classList.add('hidden'); 
   images.classList.add('loading');
   const newArrURL = [];

   if (urlArray.length > 20) {
      urlArray = urlArray.slice(0, 20);
   }

   for (let i = 0; i < urlArray.length; i++) {

      if (newArrURL.length < 10) {
         try {
            // ========= proxy ========= //
            const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const PROXI = 'https://corsproxy.io/?';
            const useProxy = isLocalhost ? PROXI : ''; // якщо isLocalhost = true, то useProxy = 'https://corsproxy.io/?', ні - useProxy = "".
            const URL = useProxy + urlArray[i]; // конкатинуємо
            console.log(URL);
            response = await fetch(URL);
            // ========= proxy ========= //

            if (response.ok) {
               newArrURL.push(urlArray[i]);
            } 
         }
         catch (error) {
            console.error(error);
         };
      }
   };

   addToList.removeAttribute('disabled', '');
   addImgToList(newArrURL);
   return newArrURL;
};


// Adding photo to assotiative gallery:
function addImgToList(arrUrl) {
   arrImgURL = arrUrl;
   arrUrl.forEach(item => {
      const imgItem = `
      <a href=${item} target="_blank">
         <img src=${item} class="image-result aspect-video object-cover rounded-md">
      </a>`;
      
      images.insertAdjacentHTML(`beforeEnd`, imgItem);
      images.classList.remove('loading');
   });
};



// ================================= Right side =============================== //


const activityContent = document.querySelector('.activity-card__content');
const rightSide = document.querySelector('.right-side');
const filters = document.querySelector('.filters');


// Showing right side and hidding left:
function showRightSide() {
   activityContent.classList.add('hidden');
   addToList.setAttribute('disabled', '');
   addToList.textContent = 'Added';
   rightSide.classList.remove('hidden');
};


// Creating my list activity:
async function createMyList() {
   const activityData = data;

   createArchive(activityData);

   const getArrayData = function (activityData) {
      if (localStorage.activity) {
         const activityArr = JSON.parse(localStorage['activity']);
         return activityArr;

      } else {
         const activityArr = activityArr.push(activityData);
         return activityArr;
      };
   };

   const arrayData = getArrayData(activityData);
   buildActivity(arrayData);
};


// Building cards activity:
function buildActivity(arrayData) {
   actyvityList.innerHTML = "";

   for (let i = 0; i < arrayData.length; i++) {
      const activityItem = `
         <li class="activity-item ${arrayData[i].type}">
            <div class="activity-data">
                  <button type="button" class="js_filterByType icon icon-type" title="sort by activity type">
                  ${arrayData[i].type}
                  </button>
                  <button type="button" class="js_filterByParticipants icon icon-participants" title="sort by participants">
                  ${arrayData[i].participants}
                  </button>
            </div>
            <div class="activity-actions">
            ${addTranslateBtn(arrayData[i])}
            ${addImgBtn(arrayData[i])}
               <button button class="icon icon-remove activity-action action-remove" type="button" title="remove it">
                  <span class="sr-only">Remove it</span>
               </button>
            </div>
            <div class="activity-name">
               ${arrayData[i].activity}
            </div>
         </li>`;
      
      actyvityList.insertAdjacentHTML(`afterBegin`, activityItem);
   };
};


// Addind translate button in card:
function addTranslateBtn(arrayData) {
   if (arrayData.translateBtn) {
      return `<button type="button" class="icon icon-translate activity-action action-translate" title="show/hide translation"></button>`;

   } else {
      return '';
   };
};


// Addind images  button in card:
function addImgBtn(arrayData) {
   if (arrayData.imgBtn) {
      return `<button type="button" class="icon icon-images activity-action action-images" title="show images"></button>`;

   } else {
      return '';
   };
};


// Add list activity to local storage:
function createArchive(object) {
   if (!(localStorage.activity) && object.type) {
      const activityObj = {};
      const activityArr = [];

      activityObj.activity = object.activity;
      activityObj.type = object.type;
      activityObj.participants = object.participants;

      if (translatedText.textContent.length > 1) {
         activityObj.translateBtn = true;
         activityObj.translateText = translatedText.textContent;
      }

      if (images.children.length > 0) {
         activityObj.imgBtn = true;
         activityObj.imgURL = arrImgURL;
         // додати url всіх зображень в об'єкт
      };

      activityArr.push(activityObj);
      localStorage.setItem('activity', JSON.stringify(activityArr));

   } else {
      const activityArr = JSON.parse(localStorage['activity']);
      const result = activityArr.filter(item => item.activity.trim() === object.activity.trim());

      if (result.length > 0) {
         showErrorMessage('Вже є така активність, спробуйте іншу.');
         return
      };

         let activityObj = {};

         activityObj.activity = object.activity;
         activityObj.type = object.type;
         activityObj.participants = object.participants;
   
         if (translatedText.textContent.length > 1) {
            activityObj.translateBtn = true;
            activityObj.translateText = translatedText.textContent;
         }
   
         if (images.children.length > 0) {
            activityObj.imgBtn = true;
            activityObj.imgURL = arrImgURL;
         }
   
         activityArr.push(activityObj);
         localStorage.setItem('activity', JSON.stringify(activityArr));
   };
};


// Show left side menu:
function showLeftSide() {
   addToList.removeAttribute('disabled', '');
   addToList.textContent = 'Add to my list';
   activityContent.classList.remove('hidden');
};


// Removing an activity from the list:
function removeActivity(target) {
   const activity = target.closest('.activity-item');
   const nameActivity = target.parentElement.nextElementSibling.textContent;
   const activityArr = JSON.parse(localStorage['activity']);
   const filterResult = activityArr.filter(item => !(item.activity.trim() === nameActivity.trim()));
   localStorage.setItem('activity', JSON.stringify(filterResult));
   activity.remove();

   if (actyvityList.childElementCount < 1) {
      delete localStorage.objForSearch;
      filters.innerHTML = '';
      buildActivity(JSON.parse(localStorage['activity']));
   };

   if (filterResult.length < 1) {
      localStorage.removeItem('activity');
      rightSide.classList.add('hidden');
      addToList.removeAttribute('disabled', '');
      addToList.textContent = 'Add to my list';
      activityCard.classList.remove('show');
   };
};


// Search activity by filter:
function searchActivity(target) {
   const searchInpute = target.value;
   const activityArr = JSON.parse(localStorage['activity']);
   const filterResult = activityArr.filter(item => item.activity.trim().toLowerCase().includes(searchInpute.trim().toLowerCase()));
   buildActivity(filterResult);
};


// creating object for search: 
function createObjForSearch(target) {
   let objForSearch = {};

   if (localStorage.objForSearch) {
      objForSearch = JSON.parse(localStorage['objForSearch']);
   } 

   if (target.classList.contains('search__input')) {
      if (target.value.length >= 1) {
         objForSearch.search = target.value;
         target.value = '';
      }
      
   } else if (target.classList.contains('js_filterByParticipants')) {
      objForSearch.participants = target.textContent.trim();
      
   } else if (target.classList.contains('js_filterByType')) {
      objForSearch.type = target.textContent.trim();
   };

   if (Object.keys(objForSearch).length > 0) {
      localStorage.setItem('objForSearch', JSON.stringify(objForSearch));
   };
};


// creating filter item:
function creatFilterItem() {
   if (localStorage.objForSearch) {
      const objForSearch = JSON.parse(localStorage['objForSearch']);
      filters.innerHTML = '';
      // console.log(objForSearch)
   
      if (objForSearch.search) {
         const filterItem = `
            <li class="filters__item" data-filter=${'search'}>
               <div class="filters__text icon icon-${'search'}">${objForSearch.search}</div>
               <button class="filters__btn icon icon-remove"></button>
            </li>`;
         
         filters.insertAdjacentHTML('beforeend', filterItem);
      };
   
      if (objForSearch.type) {
         const filterItem = `
            <li class="filters__item" data-filter=${'type'}>
               <div class="filters__text icon icon-${'type'}">${objForSearch.type}</div>
               <button class="filters__btn icon icon-remove"></button>
            </li>`;
         
         filters.insertAdjacentHTML('beforeend', filterItem);
      };
   
      if (objForSearch.participants) {
         const filterItem = `
            <li class="filters__item" data-filter=${'participants'}>
               <div class="filters__text icon icon-${'participants'}">${objForSearch.participants}</div>
               <button class="filters__btn icon icon-remove"></button>
            </li>`;
         
         filters.insertAdjacentHTML('beforeend', filterItem);
      };
   };
};


// creating activiti list by filter:
function createActivityByFilter() { 
   const activityArr = JSON.parse(localStorage['activity']);

   if (localStorage.objForSearch) {
      const objForSearch = JSON.parse(localStorage['objForSearch']);
      let filterResult = [];
   
      if (objForSearch.search) {
         filterResult = activityArr.filter(item => item.activity.trim().toLowerCase().includes(objForSearch.search.trim().toLowerCase()));
      } 
      // console.log(filterResult)
   
      if (objForSearch.participants && filterResult.length > 1) {
         filterResult = filterResult.filter(item => +item.participants === +objForSearch.participants);
   
      } else if (objForSearch.participants && !objForSearch.search) {
         filterResult = activityArr.filter(item => +item.participants === +objForSearch.participants);
      }
      // console.log(filterResult)
   
      if (objForSearch.type && filterResult.length > 1) {
         // filterResult = activityArr.filter(item => item.type === objForSearch.type);
         filterResult = filterResult.filter(item => item.type === objForSearch.type);
      } else if (objForSearch.type && !objForSearch.participants && !objForSearch.search) {
         filterResult = activityArr.filter(item => item.type === objForSearch.type);
      } 
   
      buildActivity(filterResult);

   } else {
      buildActivity(activityArr);
   };
};


// removing filter item:
function removeFilter(target) {
   const elem = target.previousElementSibling;
   const filtersItem = target.parentElement;
   const objForSearch = JSON.parse(localStorage['objForSearch']);


   if (elem.classList.contains('icon-search')) {
      delete objForSearch.search;
      
   } else if (elem.classList.contains('icon-type')) {
      delete objForSearch.type;
      
   } else if (elem.classList.contains('icon-participants')) {
      delete objForSearch.participants;
   };

   if (Object.keys(objForSearch).length < 1) {
      localStorage.removeItem('objForSearch')
   } else {
      localStorage.setItem('objForSearch', JSON.stringify(objForSearch));
   };
   
   createActivityByFilter();
   filtersItem.remove();
};



// show/hidden translate text after click by button:
function showTextTranslate(target) {
   const text = target.parentElement.nextElementSibling;
   if (text.nextElementSibling) {
      text.nextElementSibling.remove();

   } else {
      const activitys = JSON.parse(localStorage['activity']);
      let result = activitys.filter(item => item.activity === text.textContent.trim());
      const textTranslate = `<p class="translated-text">${result[0].translateText}</p>`;
      text.insertAdjacentHTML('afterEnd', textTranslate)
   };
};






// ===========================Start working ==================================== //

if (localStorage.objForSearch) {
   rightSide.classList.remove('hidden');
   createActivityByFilter();
   creatFilterItem();

} else if (localStorage.activity) {
   rightSide.classList.remove('hidden');
   buildActivity(JSON.parse(localStorage['activity']));
};