'use strict';

var heroSlider = document.querySelector('.hero-header__slider');
var sliderItems = [].slice.call(heroSlider.querySelectorAll('.hero-header__item'));
var dotsContainer = heroSlider.querySelector('.hero-header__dots');
var dots = [].slice.call(dotsContainer.querySelectorAll('.hero-header__dot'));
var arrowsContainer = heroSlider.querySelector('.hero-header__arrows');
var slideInterval = setInterval(sliderHandler, 5000);

function heroSwipeHandler(event) {
  resetInterval();
  var startCoordX = event.changedTouches[0].clientX;

  function swipeEndHandler(e) {
    var endCoordX = e.changedTouches[0].clientX;
    handleSwipe(endCoordX);
    this.removeEventListener('touchend', swipeEndHandler);
  }

  function handleSwipe(endCoordX) {
    var swipeLength = Math.abs(startCoordX - endCoordX);
    var swipeMinLength = 50;
    if (swipeLength > swipeMinLength) {
      if (startCoordX < endCoordX) {
        sliderHandler(true);
      } else if (startCoordX > endCoordX) {
        sliderHandler();
      }
    }
  }
  this.addEventListener('touchend', swipeEndHandler);
}

function arrowsClickHandler(event) {
  resetInterval();
  if (event.target.classList.contains('hero-header__arrow')) {
    if (event.target.classList.contains('hero-header__arrow--right')) {
      sliderHandler();
    } else if (event.target.classList.contains('hero-header__arrow--left')) {
      sliderHandler(true);
    }
  }
}
function dotsClickHandler(event) {
  resetInterval();
  if (event.target.classList.contains('hero-header__dot')) {
    var currentIndex = dots.indexOf(event.target);
    sliderItems.forEach(function(item) {
      item.classList.remove('hero-header__item--active');
    });
    changeSliderAndDots(currentIndex);
  }
}

function changeSliderAndDots(index) {
  sliderItems[index].classList.add('hero-header__item--active');
  changeDots(index);
}

function changeDots(index) {
  dots.forEach(function(item) {
    item.classList.remove('hero-header__dot--active');
  });
  dots[index].classList.add('hero-header__dot--active');
}

function getSliderIndex() {
  var currentSlideIndex;
    sliderItems.forEach(function(item, index) {
      if (item.classList.contains('hero-header__item--active')) {
        currentSlideIndex = index;
      }
      item.classList.remove('hero-header__item--active');
    });
    return currentSlideIndex;
  }

function sliderHandler(backward) {
  var currentSlideIndex = getSliderIndex();

  function changeSlider(backward) {
    if (backward) {
      currentSlideIndex -= 1;
    } else {
      currentSlideIndex += 1;
    }
  }

  function checkForBounds() {
    if (currentSlideIndex === sliderItems.length) {
      currentSlideIndex = 0;
    } else if (currentSlideIndex === -1) {
      currentSlideIndex = sliderItems.length - 1;
    }
  }

  changeSlider(backward);
  checkForBounds();
  changeSliderAndDots(currentSlideIndex);
}

function resetInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(sliderHandler, 5000);
}

dotsContainer.addEventListener('click', dotsClickHandler);
arrowsContainer.addEventListener('click', arrowsClickHandler);
heroSlider.addEventListener('touchstart', heroSwipeHandler);