'use strict';

console.log('Hello, worker!');
fetch('https://www.google.com', { mode: 'cors' }).then((response) => {
  console.log('worker response', response);
});
