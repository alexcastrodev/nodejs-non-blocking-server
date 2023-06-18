export default function heavy() {
    for (let i = 0; i < 1000000; i++) {
        if (i % 1000 === 0) {
            const start = Date.now()
            while (Date.now() - start < 1000) { }
        }
    }

    return { hello: 'world' }
}

