# Eventer

Simple and fast event emitter library. Subscription is based on a unique Token, which can be used to unsubscribe from the topic.

The Eventer is used in LightningChart<sup>&#174;</sup> JS charting library. [https://www.arction.com/](https://www.arction.com/)

## Installation

`npm install --save @arction/eventer`

## Documentation

Online documentation is available at [arction.github.io/eventer](https://arction.github.io/Eventer/)

## Getting started

```ts
import { Eventer } from '@arction/eventer'

const eventer = new Eventer()

// new topic is created, handler is added as the first subscriber to the topic
const token1 = eventer.on('topic1', () => console.log('I am called from topic1'))
// 'topic1' already exists, so new listener is simply added to existing collection of handlers
const token2 = eventer.on('topic1', () => console.log('I am also called from topic1'))
// new collection of handlers is created for the second topic
// the function is added to it
eventer.on('topic2', () => console.log('I am called from topic2'))

eventer.emit('topic1')
// calls two functions which listen to the event
//
// outputs:
//    I am called from topic1
//    I am also called from topic1

eventer.emit('topic2')
// calls single functions which listen to the event
//
// outputs:
//    I am called from topic2

// remove the second listener from the first topic by token 
eventer.off(token2)

eventer.emit('topic1')
// calls single functions which listen to the event
//
// outputs:
//    I am called from topic1

// remove all listeners from all topics
eventer.allOff()

eventer.emit('topic2')
// nothing happened, since all subscriptions were terminated
```

### Subscribe to topic

Subscribing to a topic is easy.

```ts
eventer.on('topic', ()=>{ console.log('Topic handler') })
```

Multiple subscriptions to a single topic can exist.

```ts
eventer.on('topic', ()=>{ console.log('Topic handler') })
eventer.on('topic2', ()=>{ console.log('Topic 2 handler') })
eventer.on('topic3', ()=>{ console.log('Topic 3 handler') })
```

### Unsubscribe from topic

You can unsubscribe from a single topic by using the *Token* returned by eventer when you subscribed to the topic.

```ts
const token = eventer.on('topic', ()=>{ console.log('Topic handler') })

eventer.off(token)
```

You can also unsubscibe all listeners from a topic.

```ts
eventer.topicOff('topic')
```

It is also possible to unsubscribe all topics and all listeners.

```ts
eventer.allOff()
```

### Emiting events

Events can be emitted for a topic. The emit can contain 0 or more arguments that will be provided to the topic listeners.

```ts
eventer.emit('topic')

eventer.on('topic2', ( arg1, arg2 ) => console.log( arg1, arg2 ))

eventer.emit('topic2', 'Hello ', 'World')
```

## Development instructions

The project is developed using TypeScript. Build system of the project heavily relies on Node.js. Dependencies are managed with *npm*, therefore, remember to run **npm install** before starting of anything else. 

There are several *npm scripts*, which are used for development process:

| Name     | Command          | Description              |
| ---------|------------------|--------------------------|
| build    | npm run build    | run build system
| test     | npm test         | run tests and watch      |
| lint     | npm run lint     | run static analyzer and watch
| docs     | npm run docs     | generate typedoc documentation
| ci:test  | npm run ci:test  | run tests once
| ci:lint  | npm run ci:lint  | run static analyzer once
| ci:watch | npm run ci:watch | run CI circle and watch
