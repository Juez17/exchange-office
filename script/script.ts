import { fetchExchangeRate } from './fetchExchangeRate.js';

const applyBtn = document.querySelector('.modal__apply') as HTMLButtonElement;
const changeBtn = document.querySelector(
  '.exchange-box__change-btn'
) as HTMLButtonElement;
const transformBtn = document.querySelector(
  '.converter-sign__image'
) as HTMLImageElement;
const loadingText = document.querySelector(
  '.converter-sign__loading'
) as HTMLSpanElement;

const modal = document.querySelector('.modal') as HTMLTableSectionElement;

const originalCurrencyImg = document.querySelectorAll(
  '.currency-area__currency-image'
)[0] as HTMLImageElement;
const desiredCurrencyImg = document.querySelectorAll(
  '.currency-area__currency-image'
)[1] as HTMLImageElement;

const originalCurrencyText = document.querySelectorAll(
  '.exchange-box__currency'
)[0] as HTMLParagraphElement;
const desiredCurrencyText = document.querySelectorAll(
  '.exchange-box__currency'
)[1] as HTMLParagraphElement;

const originalCurrencyInput = document.querySelector(
  '#original-currency'
) as HTMLInputElement;
const desiredCurrencyInput = document.querySelector(
  '#desired-currency'
) as HTMLInputElement;
const originalCurrencySelect = document.querySelector(
  '#currency-original'
) as HTMLSelectElement;
const desiredCurrencySelect = document.querySelector(
  '#currency-desired'
) as HTMLSelectElement;

enum Currencies {
  AUD = 'AUD',
  CAD = 'CAD',
  CHF = 'CHF',
  CNY = 'CNY',
  GBP = 'GBP',
  JPY = 'JPY',
  USD = 'USD',
}
type CurrencyName = 'AUD' | 'CAD' | 'CHF' | 'CNY' | 'GBP' | 'JPY' | 'USD';

const currencyImages = {
  AUD: {
    src: 'images/AUD.jpg',
    alt: 'Australian Dollar',
  },
  CAD: {
    src: 'images/CAD.png',
    alt: 'Canadian Dollar',
  },
  CHF: {
    src: 'images/CHF.jpg',
    alt: 'CHF bill',
  },
  CNY: {
    src: 'images/CNY.jpg',
    alt: 'Chinese Juan',
  },
  GBP: {
    src: 'images/GBP.jfif',
    alt: 'British Pound',
  },
  JPY: {
    src: 'images/JPY.jpg',
    alt: 'JPY bill',
  },
  USD: {
    src: 'images/USD.jpg',
    alt: 'American Dollar',
  },
};

let originalCurrency = Currencies.AUD;
let desiredCurrency = Currencies.USD;
let shouldAnimationStop = false;

const setAnimationPromise = () => {
  return new Promise((resolve) => {
    transformBtn.addEventListener('animationcancel', () => {
      console.log('koncze sie');
      loadingText.classList.remove('converter-sign__loading--animated');
      loadingText.classList.add('converter-sign__loading--hidden');
      resolve('koniec');
    });
  });
};

let animationPromise = setAnimationPromise();

type Result = { result: number };

const setImages = (pathOriginal: CurrencyName, pathDesired: CurrencyName) => {
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
  // console.log(regex.test(originalCurrencyInput.value) && Number.parseFloat(originalCurrencyInput.value) > 0);
  // console.log(originalCurrencyInput.value);
  return (
    regex.test(originalCurrencyInput.value) &&
    Number.parseFloat(originalCurrencyInput.value) > 0
  );
};

const toggleInvalidInputMessage = (invalid: boolean) => {
  invalid
    ? originalCurrencyInput.classList.add(
        'currency-area__currency-value--invalid'
      )
    : originalCurrencyInput.classList.remove(
        'currency-area__currency-value--invalid'
      );
};

const toggleModal = (e: Event) => {
  if (e.type === 'keydown') modal.classList.toggle('hidden');
  if (e.target === e.currentTarget) modal.classList.toggle('hidden');
};

changeBtn.addEventListener('click', (e) => {
  toggleModal(e);
});

transformBtn.addEventListener('animationiteration', (e) => {
  console.log('AnimationIteration');
  console.log(e);
  if (shouldAnimationStop) {
    transformBtn.classList.remove('converter-sign__image--animated');
  }
});

applyBtn.addEventListener('click', (e) => {
  if (
    originalCurrency === originalCurrencySelect.value &&
    desiredCurrency === desiredCurrencySelect.value
  ) {
    toggleModal(e);
    return;
  }

  originalCurrency = originalCurrencySelect.value as Currencies;
  desiredCurrency = desiredCurrencySelect.value as Currencies;
  setImages(originalCurrency, desiredCurrency);
  toggleModal(e);
  originalCurrencyInput.value = '';
  desiredCurrencyInput.value = '';
  originalCurrencyText.textContent = originalCurrency;
  desiredCurrencyText.textContent = desiredCurrency;
});

const rotateArrows = () => {
  transformBtn.classList.add('converter-sign__image--animated');
  loadingText.classList.add('converter-sign__loading--animated');
  loadingText.classList.remove('converter-sign__loading--hidden');
  shouldAnimationStop = false;
  animationPromise = setAnimationPromise();
};

const handleClick = () => {
  if (!canConvert()) {
    toggleInvalidInputMessage(true);
    return;
  }
  toggleInvalidInputMessage(false);

  rotateArrows();

  //uncomment to introduce calculation
  const result: Promise<Result> = new Promise((resolve, reject) => {
    resolve(
      fetchExchangeRate(
        originalCurrency,
        desiredCurrency,
        originalCurrencyInput.value
      )
    );
  });

  result
    .then((data) => {
      shouldAnimationStop = true;
      console.log(`data: in result.then() ${data.result}`);
      animationPromise.then(() => {
        desiredCurrencyInput.value = data.result.toFixed(2);
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

transformBtn.addEventListener('click', handleClick);
modal.addEventListener('click', toggleModal);

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) toggleModal(e);
});
