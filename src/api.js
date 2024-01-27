const API_KEY = 'da4f95c4e20075133d23dee2b4c68e4c5ca689b9e709f9f5486aa7df382c4ae1';

// export const loadTicker = tickers => 
//     fetch(
//         `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickers.join(",")}&api_key=${API_KEY}`
//     ).then(r => r.json());
//     console.log(loadTicker);

export const loadTicker = tickers => 
    fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickers.join(",")}&api_key=${API_KEY}`
    ).then(r => r.json());


