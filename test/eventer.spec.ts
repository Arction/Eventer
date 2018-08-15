import { notEqual, equal, check } from './tools'
import {
    assert,
    spy
} from 'sinon'
import Eventer, { Token, EventError } from './../src/eventer'
const {
    calledOnce,
    calledTwice,
    calledWithExactly,
    notCalled
} = assert

const emptyFun = () => { return }
describe('Eventer', () => {
    it('Eventers must have unique id', () => {
        const eventer1 = new Eventer()
        const eventer2 = new Eventer()
        notEqual(eventer1.id, eventer2.id)
    })
    describe('Token', () => {
        let eventer: Eventer | undefined

        beforeEach(() =>
            eventer = new Eventer()
        )
        afterEach(() =>
            eventer = undefined
        )

        it('Listeners must have unique token at the same Eventer at same topic', () => {
            const listener1 = eventer!.on('someTopic', emptyFun)
            const listener2 = eventer!.on('someTopic', emptyFun)

            notEqual(listener1.token, listener2.token)
        })
        it('Listeners must have unique token at the same Eventer, but different topics', () => {
            const listener1 = eventer!.on('someTopic1', emptyFun)
            const listener2 = eventer!.on('someTopic2', emptyFun)

            notEqual(listener1.token, listener2.token)
        })
        it('Listeners must have unique tokens at different Eventers', () => {
            const listener1 = (new Eventer()).on('someTopic1', emptyFun)
            const listener2 = eventer!.on('someTopic2', emptyFun)

            notEqual(listener1.token, listener2.token)
        })
    })
    describe('has()', () => {
        let eventer: Eventer | undefined
        let func: () => void | undefined

        beforeEach(() => {
            eventer = new Eventer()
            func = emptyFun
        })
        afterEach(() => {
            eventer = undefined
            func = undefined
        })

        it('single event existence', () => {
            const token = eventer!.on('sometopic', <any>func)
            equal(func, <any>eventer!.has(token))
        })
        it('single event existance at a topic', () => {
            const topic = 'sometopic'
            const token = eventer!.on(topic, <any>func)
            equal(func, <any>eventer!.has(token, topic))
        })
        it('multiple events existance at a topic', () => {
            const topic = 'sometopic'
            const token = eventer!.on(topic, <any>func)
            eventer!.on(topic, emptyFun)

            equal(func, <any>eventer!.has(token))
            equal(func, <any>eventer!.has(token, topic))
        })
        it('multiple events existance at different topics', () => {
            const topic1 = 'sometopic1'
            const topic2 = 'sometopic2'

            const token1 = eventer!.on(topic1, <any>func)
            const token2 = eventer!.on(topic2, emptyFun)

            equal(func, <any>eventer!.has(token1, topic1))
        })
        it('incorrect token', () => {
            check((eventer!.has(Token(0, 0)) instanceof EventError))
        })
        it('incorrect topic', () => {
            check(<any>(eventer!.has(Token(0, 0), 'sometopic')) instanceof EventError)
        })
        it('correct topic, incorrect token', () => {
            const topic = 'sometopic'
            eventer!.on(topic, emptyFun)
            check((eventer!.has(Token(0, 0), topic)) instanceof EventError)
        })
    })

    describe('remove', () => {
        let eventer: Eventer | undefined
        let token: any

        const topic = 'sometopic'

        beforeEach(() => {
            eventer = new Eventer()
            token = eventer.on(topic, emptyFun)
        })
        afterEach(() => {
            eventer = undefined
            token = undefined
        })

        it('single listener', () => {
            check(eventer!.off(token))
            check((eventer!.has(token)) instanceof EventError)
        })
        it('one of many listener', () => {
            check(eventer!.off(token))
            check((eventer!.has(token)) instanceof EventError)
        })
        it('single listener with topic', () => {
            check(eventer!.off(token, topic))
            check((eventer!.has(token, topic)) instanceof EventError)
        })
        it('one of many listener on topic', () => {
            eventer!.on(topic, emptyFun)
            check(eventer!.off(token))
            check((eventer!.has(token, topic)) instanceof EventError)
        })
        it('one of many listener on topic with topic', () => {
            eventer!.on(topic, emptyFun)
            check(eventer!.off(token, topic))
            check((eventer!.has(token, topic)) instanceof EventError)
        })
        it('single listener from eventer with multiple topics', () => {
            eventer!.on('newSometopic', emptyFun)
            check(eventer!.off(token))
            check((eventer!.has(token, topic)) instanceof EventError)
        })
        it('single listener from wrong topic', () => {
            check(!eventer!.off(token, 'new' + topic))
        })
        it('all from topic', () => {
            check(eventer!.topicOff(topic))
            check((eventer!.has(token, topic)) instanceof EventError)
        })
        it('all from empty topic', () => {
            check(!eventer!.topicOff('new' + topic))
        })
        it('from all topics', () => {
            eventer!.allOff()
            check((eventer!.has(token, topic)) instanceof EventError)
        })
    })
    describe('listeners()', () => {
        let eventer: Eventer | undefined
        let token1: any
        let token2: any

        const func1 = emptyFun
        const func2 = emptyFun
        const topic = 'sometopic'

        beforeEach(() => {
            eventer = new Eventer()
            token1 = eventer.on(topic, func1)
            token2 = eventer.on(topic, func2)

        })
        afterEach(() => {
            eventer = undefined
            token1 = undefined
            token2 = undefined
        })

        it('single listeners at topic', () => {
            const func = emptyFun
            const newTopic = 'new' + topic
            const token = eventer!.on(newTopic, func)
            const listeners = eventer!.listeners(newTopic)

            equal(listeners.size, 1)
            equal(func, listeners.get(token))
        })

        it('multiple listeners at topic', () => {
            const listeners = eventer!.listeners(topic)

            equal(listeners.size, 2)

            equal(func1, listeners!.get(token1))
            equal(func2, listeners.get(token2))
        })

        it('multiple listeners at topic, with multiple avaible topics', () => {
            const token = eventer!.on('new' + topic, emptyFun)
            const listeners = eventer!.listeners(topic)

            equal(listeners.size, 2)

            equal(func1, listeners.get(token1))
            equal(func2, listeners.get(token2))
        })
    })
    describe('emit()', () => {
        let eventer: Eventer | undefined

        beforeEach(() => {
            eventer = new Eventer()
        })
        afterEach(() => {
            eventer = undefined
        })

        it('single listener', () => {
            const func = spy()
            const topic = 'sometopic'

            eventer!.on(topic, func)
            eventer!.emit(topic)

            calledOnce(func)
        })
        it('single listener called multiple times', () => {
            const func = spy()
            const topic = 'sometopic'

            eventer!.on(topic, func)
            eventer!.emit(topic)
            eventer!.emit(topic)

            calledTwice(func)
        })
        it('single listener called with arguments', () => {
            const func = spy()
            const topic = 'sometopic'

            const args = [1, 2, 3]
            eventer!.on(topic, func)
            eventer!.emit(topic, args)

            calledOnce(func)
            calledWithExactly(func, args)
        })
        it('multiple listeners at single topic', () => {
            const func1 = spy()
            const func2 = spy()
            const topic = 'sometopic'

            eventer!.on(topic, func1)
            eventer!.on(topic, func2)
            eventer!.emit(topic)

            calledOnce(func1)
            calledOnce(func2)
        })
        it('multiple listeners at multiple topics', () => {
            const func1 = spy()
            const func2 = spy()
            const topic1 = 'sometopic1'
            const topic2 = 'sometopic2'

            eventer!.on(topic1, func1)
            eventer!.on(topic2, func2)
            eventer!.emit(topic1)

            calledOnce(func1)
            notCalled(func2)
        })
        it('remove listener is not colled', () => {
            const func = spy()
            const topic = 'sometopic'
            const token = eventer!.on(topic, func)

            eventer!.off(token)
            eventer!.emit(topic)

            notCalled(func)
        })
    })
})
