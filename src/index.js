import Fastify from 'fastify'
import heavy from './heavy.js'
import { fork } from 'child_process'
import { Worker } from 'worker_threads'

const fastify = Fastify()
  
fastify.get('/blocking', (request, reply) => {
    reply.send(heavy())
})

fastify.get('/fork', (request, reply) => {
    const child_process = fork('./src/heavy-fork.js')
    child_process.on('message', (msg) => {
        reply.send({ hello: 'world' })
    })
})

fastify.get('/worker', async (request, reply) => {
    const worker = new Worker('./src/worker.js');

    reply.raw.writeHead(200, {
        Connection: 'keep-alive',
        'Content-Type': 'application/json',
    })

    // await new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         resolve()
    //     }, 4000)
    // })

    worker.once('message', (msg) => {
        reply.send(msg)
    })
})

fastify.get('/', (request, reply) => {
    reply.send({ hello: 'world' })
})

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`)
})
