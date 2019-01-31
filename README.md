# Eventer

Simple and fast event emitter library. Subscription is based on a unique Token, which can be used to unsubscribe from the topic.

## Installation

`npm install --save @arction/eventer`

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

## Development instructions

The project is developed using TypeScript. Build system of the project heavily relies on Node.js. Dependencies are managed with *npm*, therefore, remember to run **npm install** before starting of anything else. 

There are several *npm scripts*, which are used for development process:

| Name     | Command          | Description              |
| ---------|------------------|--------------------------|
| test     | npm test         | run tests and watch      |
| lint     | npm run lint     | run static analyzer and watch
| ci:test  | npm run ci:test  | run tests once
| ci:lint  | npm run ci:lint  | run static analyzer once
| ci:watch | npm run ci:watch | run CI circle and watch
| build    | npm run build    | run build system
| docs     | npm run docs     | generate typedoc documentation

## Contributors Guidelines

It is not permitted to do direct commit to master except, small fixes for broken master CI. Each feature has to implemented in a separate branch. Each merge request has to be checked by one of team members to satisfy code standards and fit to existing architecture.

All Classes, Types, Interfaces and functions(except getters and setters) have to be commented in according to TypeDoc guidelines.

"Clean" code has to be written in according to with the best practices for high-performance JavaScript and TypeScript. The code has to be as simple and as DRY as possible, it should not contain any unnecessary sophisticated constructions. Side effects have to be reduced.
