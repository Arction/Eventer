// { notEqual, equal, check, expect, include, mockConsoleLog }  = require '../testTools'
// {
//     assert: {
//         calledOnce,
//             calledTwice,
//             calledWithExactly,
//             notCalled
//     },
//     spy
// } = require 'sinon'
// { EventError } = include '/internal/errors'
// log = mockConsoleLog()
// { Scale, Vec2, Token } = include '/common/factories'
// [Eventer] = include '/internal/eventer'

// describe 'Eventer', ->
//     it 'Eventers must have unique id', ->
//         eventer1 = new Eventer()
// eventer2 = new Eventer()
// check eventer1.id != eventer2.id

// describe 'Token', ->
//     eventer = undefined

// beforeEach -> eventer = new Eventer()
// afterEach -> eventer = undefined

// it 'Listeners must have unique token at the same Eventer at same topic', ->
//     listener1 = eventer.on "someTopic", ->
//         listener2 = eventer.on "someTopic", ->

//             notEqual listener1.token, listener2.token

// it 'Listeners must have unique token at the same Eventer, but different topics', ->
//     listener1 = eventer.on "someTopic1", ->
//         listener2 = eventer.on "someTopic2", ->

//             notEqual listener1.token, listener2.token

// it 'Listeners must have unique tokens at different Eventers', ->
//     listener1 = (new Eventer()).on "someTopic1", ->
//         listener2 = eventer.on "someTopic2", ->

//             notEqual listener1.token, listener2.token

// describe 'has()', ->
//     eventer = undefined
// func = undefined

// beforeEach ->
//     eventer = new Eventer()
// func = ->

//     afterEach ->
//     eventer = undefined
// func = undefined

// it 'single event existence', ->
//     token = eventer.on 'sometopic', func
// equal func, eventer.has token

// it 'single event existance at a topic', ->
//     topic = 'sometopic'
// token = eventer.on topic, func
// equal func, eventer.has token, topic

// it 'multiple events existance at a topic', ->
//     topic = 'sometopic'
// token = eventer.on topic, func
// eventer.on topic, ->

//     equal func, eventer.has token
// equal func, eventer.has token, topic

// it 'multiple events existance at different topics', ->
//     topic1 = 'sometopic1'
// topic2 = 'sometopic2'

// token1 = eventer.on topic1, func
// token2 = eventer.on topic2, ->

//     equal func, eventer.has token1, topic1

// it 'incorrect token', ->
//     check((eventer.has Token 0, 0) instanceof EventError )

// it 'incorrect topic', ->
//     check((eventer.has Token(0, 0), "sometopic") instanceof EventError )

// it 'correct topic, incorrect token', ->
//     topic = 'sometopic'
// eventer.on topic, ->
//     check((eventer.has Token(0, 0), topic) instanceof EventError )

// describe 'remove', ->
//     eventer = undefined
// token = undefined

// topic = 'sometopic'

// beforeEach ->
//     eventer = new Eventer()
// token = eventer.on topic, ->

//     afterEach ->
//     eventer = undefined
// token = undefined

// it 'single listener', ->
//     check eventer.off token
// check((eventer.has token) instanceof EventError )

// it 'one of many listener', ->
//     check eventer.off token
// check((eventer.has token) instanceof EventError )

// it 'single listener with topic', ->
//     check eventer.off token, topic
// check((eventer.has token, topic) instanceof EventError )

// it 'one of many listener on topic', ->
//     eventer.on topic, ->
//         check eventer.off token
// check((eventer.has token, topic) instanceof EventError )

// it 'one of many listener on topic with topic', ->
//     eventer.on topic, ->
//         check eventer.off token, topic
// check((eventer.has token, topic) instanceof EventError )

// it 'single listener from eventer with multiple topics', ->
//     eventer.on 'newSometopic', ->
//         check eventer.off token
// check((eventer.has token, topic) instanceof EventError )

// it 'single listener from wrong topic', ->
//     check!eventer.off token, 'new' + topic

// it 'all from topic', ->
//     check eventer.topicOff topic
// check((eventer.has token, topic) instanceof EventError )

// it 'all from empty topic', ->
//     check!eventer.topicOff 'new' + topic

// it 'from all topics', ->
//     eventer.allOff()
// check((eventer.has token, topic) instanceof EventError )

// describe 'listeners()', ->
//     eventer = undefined
// token1 = undefined
// token2 = undefined

// func1 = ->
//     func2 = ->
//         topic = 'sometopic'

// beforeEach ->
//     eventer = new Eventer()
// token1 = eventer.on topic, func1
// token2 = eventer.on topic, func2

// afterEach ->
//     eventer = undefined
// token1 = undefined
// token2 = undefined

// it 'single listeners at topic', ->
//     func = ->
//         newTopic = 'new' + topic
// token = eventer.on newTopic, func
// listeners = eventer.listeners newTopic

// check listeners.size == 1
// equal func, listeners.get token

// it 'multiple listeners at topic', ->
//     listeners = eventer.listeners topic

// check listeners.size == 2

// equal func1, listeners.get token1
// equal func2, listeners.get token2

// it 'multiple listeners at topic, with multiple avaible topics', ->
//     token = eventer.on 'new' + topic, ->
//         listeners = eventer.listeners topic

// check listeners.size == 2
// equal func1, listeners.get token1
// equal func2, listeners.get token2

// describe 'emit()', ->
//     eventer = undefined

// beforeEach -> eventer = new Eventer()
// afterEach -> eventer = undefined

// it 'single listener', ->
//     func = spy()
// topic = "sometopic"

// eventer.on topic, func
// eventer.emit topic

// calledOnce func

// it 'single listener called multiple times', ->
//     func = spy()
// topic = "sometopic"

// eventer.on topic, func
// eventer.emit topic
// eventer.emit topic

// calledTwice func

// it 'single listener called with arguments', ->
//     func = spy()
// topic = "sometopic"

// args = [1, 2, 3]
// eventer.on topic, func
// eventer.emit topic, args

// calledOnce func
// calledWithExactly func, args

// it 'multiple listeners at single topic', ->
//     func1 = spy()
// func2 = spy()
// topic = "sometopic"

// eventer.on topic, func1
// eventer.on topic, func2
// eventer.emit topic

// calledOnce func1
// calledOnce func2

// it 'multiple listeners at multiple topics', ->
//     func1 = spy()
// func2 = spy()
// topic1 = "sometopic1"
// topic2 = "sometopic2"

// eventer.on topic1, func1
// eventer.on topic2, func2
// eventer.emit topic1

// calledOnce func1
// notCalled  func2

// it 'remove listener is not colled', ->
//     func = spy()
// topic = "sometopic"

// token = eventer.on topic, func
// eventer.off token
// eventer.emit topic

// notCalled func

