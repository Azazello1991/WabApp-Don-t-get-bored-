import PhotoSwipeLightbox from 'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.3.3/photoswipe-lightbox.esm.min.js';

const lightbox = new PhotoSwipeLightbox({
   showHideAnimationType: 'none',
   pswpModule: () => import('https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.3.3/photoswipe.esm.min.js')
});


document.addEventListener('click', (e) => {
   const target = e.target;
   
   if (target.classList.contains('action-images')) {
      const activitys = JSON.parse(localStorage['activity']);
      const nameActivity = target.parentElement.nextElementSibling.textContent.trim();
      let result = activitys.find(item => item.activity === nameActivity);
      const arrURL = result.imgURL;

      lightbox.addFilter('numItems', () => {
         return arrURL.length; /* Треба повернути кількість слайдів */;
      });

      lightbox.addFilter('itemData', (itemData, index) => { 
         return {
            src: `${arrURL[index]}`, /* вказати шлях до зображення */
            width: 500,
            height: 500
         };
      });
      
      lightbox.init();
      lightbox.loadAndOpen(0);
   };
});