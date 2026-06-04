import { io } from 'socket.io-client';

const socket = io('https://auctionx-guan.onrender.com'); // backend server URL

export default socket;