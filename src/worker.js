import { parentPort } from 'node:worker_threads';
import heavy from './heavy.js'

parentPort.on('message', (msg) => {
    parentPort.postMessage(heavy())
})