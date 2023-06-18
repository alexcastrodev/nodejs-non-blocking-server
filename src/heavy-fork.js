import heavy from './heavy.js'

const payload = heavy()

process.send(payload)
process.exit()