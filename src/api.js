const API_KEY = "da4f95c4e20075133d23dee2b4c68e4c5ca689b9e709f9f5486aa7df382c4ae1";

// const tickersHandlers = new Map(); // {}
// const socket = new WebSocket(
//   `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
// );

// const AGGREGATE_INDEX = "5";

// socket.addEventListener("message", e => {
//   const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(
//     e.data
//   );
//   if (type !== AGGREGATE_INDEX || newPrice === undefined) {
//     return;
//   }

//   const handlers = tickersHandlers.get(currency) ?? [];
//   handlers.forEach(fn => fn(newPrice));
// });

// function sendToWebSocket(message) {
//   const stringifiedMessage = JSON.stringify(message);

//   if (socket.readyState === WebSocket.OPEN) {
//     socket.send(stringifiedMessage);
//     return;
//   }

//   socket.addEventListener(
//     "open",
//     () => {
//       socket.send(stringifiedMessage);
//     },
//     { once: true }
//   );
// }

// function subscribeToTickerOnWs(ticker) {
//   sendToWebSocket({
//     action: "SubAdd",
//     subs: [`5~CCCAGG~${ticker}~USD`]
//   });
// }

// function unsubscribeFromTickerOnWs(ticker) {
//   sendToWebSocket({
//     action: "SubRemove",
//     subs: [`5~CCCAGG~${ticker}~USD`]
//   });
// }

// export const subscribeToTicker = (ticker, cb) => {
//   const subscribers = tickersHandlers.get(ticker) || [];
//   tickersHandlers.set(ticker, [...subscribers, cb]);
//   subscribeToTickerOnWs(ticker);
// };

// export const unsubscribeFromTicker = ticker => {
//   tickersHandlers.delete(ticker);
//   unsubscribeFromTickerOnWs(ticker);
// };

//========================================================================================================================================================
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

const tickersHandlers = new Map(); // {}

const AGGREGATE_INDEX = "5";

socket.addEventListener("message", (e) => {
  //const data = JSON.parse(e.data);
  //console.log(data);
  const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(e.data);
  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return;
  }

  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach((fn) => fn(newPrice));
});

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage);
    },
    { once: true }
  );
}

export const subscribeToTicker = (ticker, cb) => {
  if (!tickersHandlers.has(ticker)) {
    tickersHandlers.set(ticker, []);
    sendToWebSocket({
      action: "SubAdd",
      subs: [`5~CCCAGG~${ticker}~USD`],
    });
  }

  tickersHandlers.get(ticker).push(cb);
};

export const unsubscribeFromTicker = (ticker, cb) => {
  const handlers = tickersHandlers.get(ticker);
  if (handlers) {
    const index = handlers.indexOf(cb);
    if (index !== -1) {
      handlers.splice(index, 1);
    }

    if (handlers.length === 0) {
      tickersHandlers.delete(ticker);
      sendToWebSocket({
        action: "SubRemove",
        subs: [`5~CCCAGG~${ticker}~USD`],
      });
    }
  }
};


