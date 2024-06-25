// // src/echo.js
// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';
// import axios from 'axios';
// window.Pusher = Pusher;

// Pusher.logToConsole = true;

// const echo = new Echo({
//     broadcaster: 'pusher',
//     key: '6a9965a31f8e5c9ff5e9', // Your Pusher app key
//     cluster: 'ap1', // Your Pusher app cluster
//     forceTLS: true,
//     authorizer: (channel, options) => {
//         return {
//             authorize: (socketId, callback) => {
//                 axios.post('http://localhost:8000/broadcasting/auth', {
//                     socket_id: socketId,
//                     channel_name: channel.name
//                 })
//                 .then(response => {
//                     callback(false, response.data);
//                 })
//                 .catch(error => {
//                     callback(true, error);
//                 });
//             }
//         };
//     }
// });

// export default echo;
