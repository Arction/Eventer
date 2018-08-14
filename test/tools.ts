import * as chai from 'chai'
import 'mocha'
// ************** Number of handy testing functions **************
/**
 * Proxy for chai.expect
 */
export const expect = chai.expect
/**
 * Verify that result is true
 * @param result Result of boolean expression, which should be verified
 */
export const check = (result: boolean) => expect(result).to.be.true
/**
 * Verify that two values are deeply equal
 * @param obj1 Object which should be deeply equal to obj2
 * @param obj2 Object which should be deeply equal to obj1
 */
export const equal = <T = any>(obj1: T, obj2: T) => expect(obj1).to.eql(obj2)
/**
 * Verify that two values are not deeply equal
 * @param obj1 Object which should not be deeply equal to obj2
 * @param obj2 Object which should not be deeply equal to obj1
 */
export const notEqual = <T = any>(obj1: T, obj2: T) => expect(obj1).to.not.eql(obj2)
