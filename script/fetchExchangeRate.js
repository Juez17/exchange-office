export const fetchExchangeRate = (original, desired, amount) => {
    var myHeaders = new Headers();
    myHeaders.append('apikey', 'x62quJ1zJIdR38PnAlM8Dc7Uah5jfaGa');
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders,
    };
    return fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${desired}&from=${original}&amount=${amount}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
        return result;
    })
        .catch((error) => console.log('error', error));
};
