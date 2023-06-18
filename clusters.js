import { availableParallelism } from 'node:os';
import cluster from 'node:cluster';
import process from 'node:process';
import Fastify from 'fastify'
import heavy from './src/heavy.js'
// Available Node V20
const numCPUs = availableParallelism();

const fastify = Fastify()


if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running ~ numCPUs ${numCPUs}`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  console.log(`Worker ${process.pid} started`);

  fastify.get('/', (request, reply) => {
    reply.send({ hello: 'world', pid: process.pid })
  })
  fastify.get('/reports', (request, reply) => {
    const reports = new Array(100).fill({ file: 'file.pdf', status: 'pending', pid: process.pid }).map((item, index) => {
      return { ...item, id: index }
    })

    reply.send(reports)
  })

  fastify.get('/blocking', (request, reply) => {
    reply.send(heavy())
  })
  
  fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err
    console.log(`Worker ${process.pid} listening on port ${address}`)
  })
}