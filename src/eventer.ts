/**
 * Eventer error message, adds 'EventError:' prefix to error message
 */
export class EventError extends Error {
    constructor(m: string) {
        const errorMessage = `EventError: ${m}}`
        super(errorMessage)
        // Stupid workaround for a smooth support of ES5
        Object.setPrototypeOf(this, EventError.prototype)
    }
}
/**
 * Event Listener interface
 */
export type Listener = (...args: any[]) => void
/**
 * Subscription representation
 */
export interface Token {
    /**
     * Unique token ID
     */
    readonly token: string,
    /**
     * ID of Eventer issued the token
     */
    readonly ownerIndex: number,
    /**
     * Internal token ID, might be in collision with another Eventer instance
     */
    readonly id: number
}
/**
 * @param ownerIndex Index of Eventer
 * @param id         Index of current subscription
 * @return           Unique Token
 */
export const Token = (ownerIndex: number, id: number): Token => ({
    token: `${ownerIndex}-${id}`,
    ownerIndex,
    id
})
// Every eventer has to have unique id across an app
let lastId = 0
/**
 * Creates Error for non-existing event listener.
 * The Error message is used in multiple occasions.
 * @param token Token of non-existing event
 * @param id    Eventer id
 */
const notExistReport = (token: Token, id: number) =>
    new EventError(`Event listener with ${token.token} id does not exist at Eventer with ${id} id.`)
/**
 * Pub/Sub for internal event scheduling.
 * All functions are for protected usage.
 * Sub class can use them for implementation of event dispaching.
 * @property  id  Unique Eventer id
 */
export class Eventer {
    /**
     * Unique id
     */
    readonly id = ++lastId
    /**
     * Index of last issued token
     */
    private lastEventIndex = 0
    /**
     * Collection of topics
     */
    private readonly topics: Map<string, Map<Token, Listener>> = new Map()
    /**
     *
     */
    constructor() { }
    /**
     * Register subscription on the topic with provided listener
     * @param topic     Topic name
     * @param listener  Event listener
     * @param oldToken  Old token, if it has to be reused
     */
    on(topic: string, listener: Listener, oldToken?: Token): Token {
        const listeners = this.topics.get(topic)
        // use old token or create unique one
        const token = oldToken ? oldToken : Token(this.id, ++this.lastEventIndex)
        if (listeners)
            //add listener to the topic
            listeners.set(token, listener)
        else
            //create new topic with the listener
            this.topics.set(topic, new Map([[token, listener]]))
        return token
    }
    /**
     * Check if listener with provided token exists
     * @param token Token of desired listener
     * @param topic Topic which has to contain the listener
     * @return      Error with message or Listener
     */
    has(token: Token, topic?: string): EventError | Listener {
        //if topic is specified
        if (topic) {
            // request all listeners subscribed to the topic
            const listeners = this.topics.get(topic)
            if (listeners) {
                // request listener with the token
                const listener = listeners.get(token)
                if (listener)
                    // return the listener if it is defined
                    return listener
                else
                    // return error if it is not defined
                    return notExistReport(token, this.id)
            } else
                // return error if topic is empty
                return new EventError(`Eventer with ${token.ownerIndex} does not have ${topic}.`)
        } else {
            //iterate over all topics
            for (const [_, listeners] of this.topics) {
                //check if it has listener with desired token
                const listener = listeners.get(token)
                if (listener)
                    //return the listener
                    return listener
            }
            // return an error with none of topics contains listeners with desired token.
            return notExistReport(token, this.id)
        }
    }
    /**
     * Remove listener with provided token
     * @param token Token of the listener
     * @param topic Topic which has to contain the listener
     * @return      True if the listener is successfully removed and false if it is not found
     */
    off(token: Token, topic?: string) {
        //if topic is specified
        if (topic) {
            // request all listeners subscribed to the topic
            const listeners = this.topics.get(topic)
            if (listeners)
                // check listener with the token existance
                if (listeners.delete(token))
                    return true
            // return false with the topic does not contain listener with specified token
            return false
        } else {
            //itarate over all topics
            for (const [_, listeners] of this.topics)
                // check listener with the token existance
                if (listeners.delete(token))
                    return true
            // return false with all topics do not contain listener with specified token
            return false
        }
    }
    /**
     * Remove all topics with all listeners
     */
    allOff() {
        this.topics.clear()
        return this
    }
    /**
     * Remove topic with all listeners
     * @param topic Topic name
     * @return      True if the topic is successfully removed and false if it is not found
     */
    topicOff(topic: string) {
        return this.topics.delete(topic)
    }
    /**
     * Emit event and call subscribed listeners
     * @param   topic Topic name
     * @param   args  Array of arguments
     * @return        Number of listeners called
     */
    emit(topic: string, ...args: Array<any>): number {
        // request all listeners subscribed to the topic
        const listeners = this.topics.get(topic)
        let numberOfListeners = 0
        // if listerens exist
        if (listeners)
            // iterate over
            listeners.forEach((listener) => {
                // call listener
                listener(...args)
                numberOfListeners++
            })
        return numberOfListeners
    }
    /**
     * Get All listeners at the topic
     * @param topic Topic name
     */
    listeners(topic: string) {
        const listeners = this.topics.get(topic)
        if (listeners)
            return listeners
        else
            return new Map<Token, Listener>()
    }
}
