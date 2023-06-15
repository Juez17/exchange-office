import { fetchExchangeRate } from "./fetchExchangeRate.js";
const applyBtn = document.querySelector('.modal__apply');
const changeBtn = document.querySelector('.exchange-box__change-btn');
const transformBtn = document.querySelector('.converter-sign__image');
const loadingText = document.querySelector('.converter-sign__loading');
const modal = document.querySelector('.modal');
const originalCurrencyImg = document.querySelectorAll('.currency-area__currency-image')[0];
const desiredCurrencyImg = document.querySelectorAll('.currency-area__currency-image')[1];
const originalCurrencyText = document.querySelectorAll('.exchange-box__currency')[0];
const desiredCurrencyText = document.querySelectorAll('.exchange-box__currency')[1];
const originalCurrencyInput = document.querySelector('#original-currency');
const desiredCurrencyInput = document.querySelector('#desired-currency');
const originalCurrencySelect = document.querySelector('#currency-original');
const desiredCurrencySelect = document.querySelector('#currency-desired');
var Currencies;
(function (Currencies) {
    Currencies["AUD"] = "AUD";
    Currencies["CAD"] = "CAD";
    Currencies["CHF"] = "CHF";
    Currencies["CNY"] = "CNY";
    Currencies["GBP"] = "GBP";
    Currencies["JPY"] = "JPY";
    Currencies["USD"] = "USD";
})(Currencies || (Currencies = {}));
;
const currencyImages = {
    AUD: {
        src: 'images/AUD.jpg',
        alt: 'Australian Dollar'
    },
    CAD: {
        src: 'images/CAD.png',
        alt: 'Canadian Dollar'
    },
    CHF: {
        src: 'images/CHF.jpg',
        alt: 'CHF bill'
    },
    CNY: {
        src: 'images/CNY.jpg',
        alt: 'Chinese Juan'
    },
    GBP: {
        src: 'images/GBP.jfif',
        alt: 'British Pound'
    },
    JPY: {
        src: 'images/JPY.jpg',
        alt: 'JPY bill'
    },
    USD: {
        src: 'images/USD.jpg',
        alt: 'American Dollar'
    }
};
let originalCurrency = Currencies.AUD;
let desiredCurrency = Currencies.USD;
let shouldAnimationStop = false;
const setAnimationPromise = () => {
    return new Promise((resolve) => {
        transformBtn.addEventListener('animationcancel', () => {
            loadingText.classList.remove('converter-sign__loading--animated');
            loadingText.classList.add('converter-sign__loading--hidden');
            resolve('koniec');
        });
    });
};
let animationPromise = setAnimationPromise();
const setImages = (pathOriginal, pathDesired) => {
    const originalImageObj = currencyImages[pathOriginal];
    const desiredImageObj = currencyImages[pathDesired];
    //set original currency image and alternative text
    originalCurrencyImg.src = originalImageObj.src;
    originalCurrencyImg.alt = originalImageObj.alt;
    //set desired currency image and alternative text
    desiredCurrencyImg.src = desiredImageObj.src;
    desiredCurrencyImg.alt = desiredImageObj.alt;
};
const canConvert = () => {
    return isInputValid() && areCurrenciesDifferent();
};
const areCurrenciesDifferent = () => {
    return originalCurrency !== desiredCurrency;
};
const isInputValid = () => {
    const regex = /^([1-9]{1}([0-9]*\.{0,1}[0-9]+){0,1})|(0{1}\.{1}[0-9]+)$/g;
    return regex.test(originalCurrencyInput.value) && Number.parseFloat(originalCurrencyInput.value) > 0;
};
const toggleInvalidInputMessage = (invalid) => {
    invalid ? originalCurrencyInput.classList.add('currency-area__currency-value--invalid') : originalCurrencyInput.classList.remove('currency-area__currency-value--invalid');
};
const toggleModal = (e) => {
    if (e.type === 'keydown')
        modal.classList.toggle('hidden');
    if (e.target === e.currentTarget)
        modal.classList.toggle('hidden');
};
changeBtn.addEventListener('click', (e) => {
    toggleModal(e);
});
transformBtn.addEventListener('animationiteration', (e) => {
    if (shouldAnimationStop) {
        transformBtn.classList.remove('converter-sign__image--animated');
    }
});
applyBtn.addEventListener('click', (e) => {
    if (originalCurrency === originalCurrencySelect.value && desiredCurrency === desiredCurrencySelect.value) {
        toggleModal(e);
        return;
    }
    originalCurrency = originalCurrencySelect.value;
    desiredCurrency = desiredCurrencySelect.value;
    setImages(originalCurrency, desiredCurrency);
    toggleModal(e);
    originalCurrencyInput.value = '';
    desiredCurrencyInput.value = '';
    originalCurrencyText.textContent = originalCurrency;
    desiredCurrencyText.textContent = desiredCurrency;
});
const rotateArrows = () => {
    // const deg = transformBtn.style.getPropertyValue('rotate').slice(0, -3) || 0;
    transformBtn.classList.add('converter-sign__image--animated');
    loadingText.classList.add('converter-sign__loading--animated');
    loadingText.classList.remove('converter-sign__loading--hidden');
    shouldAnimationStop = false;
    animationPromise = setAnimationPromise();
    // transformBtn.style.rotate = `${+deg + 360}deg`;
    // transformBtn.style.opacity = '0.6';
    // transformBtn.removeEventListener('click', handleClick)
    // setTimeout(()=> {
    //     transformBtn.addEventListener('click', handleClick);
    //     transformBtn.style.opacity = '1';
    // }, 2000);
};
const handleClick = () => {
    if (!canConvert()) {
        toggleInvalidInputMessage(true);
        return;
    }
    toggleInvalidInputMessage(false);
    rotateArrows();
    // const rotated = new Promise(resolve => {
    //     resolve(rotateArrows());
    // });
    //uncomment to introduce calculation
    // rotated.then(resolve => {
    const result = new Promise((resolve, reject) => {
        resolve(fetchExchangeRate(originalCurrency, desiredCurrency, originalCurrencyInput.value));
    });
    result
        .then(data => {
        shouldAnimationStop = true;
        animationPromise.then(() => {
            desiredCurrencyInput.value = data.result.toFixed(2);
        });
    })
        .catch(err => {
        console.error(err);
    });
    // });
};
transformBtn.addEventListener('click', handleClick);
modal.addEventListener('click', toggleModal);
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !(modal.classList.contains('hidden')))
        toggleModal(e);
});
