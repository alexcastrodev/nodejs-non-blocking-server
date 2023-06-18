
# Node.js - I/O do servidor não bloqueante

Este projeto é um exemplo simples de I/O do servidor não bloqueante usando o Node.js.

Nós temos 4 endpoints da API:

- `/` => para testar e retornar uma mensagem simples
- `/blocking` => para testar e retornar uma mensagem simples, mas com uma função bloqueadora
- `/fork` => para testar e retornar uma mensagem simples, mas com uma função de fork
- `/worker` => para testar e retornar uma mensagem simples, mas com uma função de worker

## Requisitos

- Node.js 20.x (apenas para os clusters)

Se você quiser usar os endpoints de fork ou worker, você pode usar o Node.js 18.x LTS.

## Como executar

- Clone este repositório

- Execute `npm install`

- Execute `npm start`

## Explicação

No Node.js, tanto forks quanto worker threads são mecanismos para alcançar paralelismo e concorrência, mas eles diferem em suas implementações subjacentes e casos de uso.

### Fork

- Fazer um fork refere-se à criação de um novo processo filho que é uma réplica do processo pai. O processo filho é executado como uma entidade separada e possui seu próprio espaço de memória.

- Ao fazer um fork de um processo, você essencialmente cria uma nova instância do tempo de execução do Node.js, permitindo que você aproveite múltiplos núcleos da CPU e distribua a carga de trabalho.

- O fork é tipicamente usado para processamento paralelo, como executar várias instâncias de um servidor ou lidar com tarefas computacionalmente intensivas. A comunicação entre os processos pai e filho é realizada por meio de mecanismos de comunicação interprocessual (IPC), como sockets, pipes ou mensagens.

- O módulo `child_process` no Node.js fornece a funcionalidade para fazer forks de processos filhos.

### Worker Threads

- As worker threads, por outro lado, são threads leves dentro de um único processo do Node.js. Elas permitem que você execute código JavaScript em paralelo no mesmo espaço de memória.

- As worker threads são úteis para transferir tarefas intensivas de CPU e aproveitar vários núcleos sem criar processos separados.

- As worker threads permitem a execução paralela, mas elas compartilham a memória com a thread principal, permitindo uma comunicação eficiente e compartilhamento de dados sem a sobrecarga da comunicação entre processos.

- O módulo `worker_threads` no Node.js fornece a API para criar e gerenciar as worker threads.

Em resumo, o fork cria processos separados com seu próprio espaço de memória, enquanto as worker threads são threads leves dentro de um único processo que compartilham memória. O fork é tipicamente usado para processamento paralelo e distribuição do trabalho em vários núcleos, enquanto as worker threads são adequadas para execução concorrente e transferência de tarefas intensivas de CPU dentro de um único processo.

## Clusters

AVISO: Isso não substitui um balanceador de carga como o Nginx ou o HAProxy. Em vez disso, é uma maneira de dimensionar um aplicativo em várias CPUs e núcleos.

Clusters são uma forma de dimensionar um aplicativo delegando tarefas para vários processos Workers. Eles são úteis para aproveitar sistemas com vários núcleos e otimizar a utilização de recursos.

Um cluster é um conjunto de Workers semelhantes em execução sob um processo pai Node.js. O processo pai é chamado de mestre e os Workers são chamados de slave.

O módulo de cluster no Node.js fornece uma maneira fácil de criar processos filhos que compartilham todas as portas do servidor.

O módulo de cluster suporta dois métodos de distribuição de conexões de entrada.

- O primeiro método é o balanceamento de carga round-robin, onde o servidor pai distribui as conexões de entrada sequencialmente entre os processos filhos. O balanceamento de carga round-robin é simples, mas não leva em consideração a carga de trabalho de cada processo filho.


<img src="./.github/clusters.png" />

Observe que as PORTAS são compartilhadas, então se você executar o aplicativo na mesma máquina, como:

```bash
$ node clusters.js
Primary 79037 is running ~ numCPUs 8
Worker 79038 started
Worker 79038 listening on port http://[::1]:3000
Worker 79039 started
Worker 79039 listening on port http://[::1]:3000
Worker 79040 started
Worker 79040 listening on port http://[::1]:3000
Worker 79042 started
Worker 79042 listening on port http://[::1]:3000
Worker 79044 started
Worker 79044 listening on port http://[::1]:3000
Worker 79045 started
Worker 79045 listening on port http://[::1]:3000
Worker 79043 started
Worker 79043 listening on port http://[::1]:3000
Worker 79041 started
Worker 79041 listening on port http://[::1]:3000
```

Você verá que a porta 3000 é compartilhada entre os Workers.

E se você abrir o navegador e acessar o endpoint http://localhost:3000/blocking, verá que a solicitação será tratada por um dos Workers.

Isso bloqueará um dos Workers e, se você tentar acessar o endpoint http://localhost:3000, será tratado por outro Worker.

Se você abrir o navegador e acessar o endpoint http://localhost:3000/blocking, será bloqueado novamente.

Se você abrir várias abas no navegador e acessar o endpoint http://localhost:3000/blocking, você quebrará o aplicativo, HAHA XD

Como eu fiz aqui:

<img src="./.github/show-off.png" />


References:

- https://nodejs.org/api/child_process.html

- https://nodejs.org/api/worker_threads.html

- https://www.freecodecamp.org/news/node-js-child-processes-everything-you-need-to-know-e69498fe970a/



