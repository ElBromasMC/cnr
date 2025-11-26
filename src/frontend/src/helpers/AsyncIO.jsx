
const map = f => {
    return list => list.map(f)
}

export class AsyncIO {
    constructor(fpse) {
        this.__fpse = fpse
        this.__pse  = null
        this.__name = "AsyncIO"
    }

    resolve() {
        this.__pse = this.__pse !== null ? this.__pse : this.__fpse()
        return this.__pse
    }

    static of(fpse) {
        return new AsyncIO(() => {
            return fpse()
                .then(Maybe.just)
                .catch(Maybe.nothing)
        })
    }

    static pure(val) {
        return new AsyncIO(() => {
            return Promise.resolve(val)
        })
    }

    static ap(fval) {
        return val => fval.ap(val)
    }

    static sequenceL(list) {
        return new AsyncIO(() => {
            return Promise.all(list.map(AsyncIO.resolve))
        })
    }

    static resolve(asyncIO) {
        return asyncIO.resolve()
    }

    fmap(f) {
        return new AsyncIO(() => {
            return this.resolve()
                .then(f)
        })
    }

    ap(asyncIO) {
        return new AsyncIO(() => {
            return Promise.all([this.resolve(), asyncIO.resolve()])
                .then(([f, val]) => f(val))
        })
    }

    join() {
        return new AsyncIO(() => {
            return this.resolve()
                .then(val2 => val2.resolve())
        })
    }

    chain(f) {
        return this.fmap(f).join()
    }

    toMaybeA() {
        return new MaybeA(this)
    }

    fmapL(f) {
        return this.fmap(map(f))
    }
}

export class Maybe {

    static of(val) {
        return (val === null || val === undefined) ? new Nothing() : new Just(val)
    }

    static pure(val) {
        return new Just(val)
    }

    static just(val) {
        return new Just(val)
    }

    static ap(fval) {
        return val => fval.ap(val)
    }

    static nothing() {
        return new Nothing()
    }

    static isJust(maybe) {
        return maybe.__name === "Just"
    }

    static isNothing(maybe) {
        return maybe.__name === "Nothing"
    }

    static fmap(f) {
        return maybe => maybe.fmap(f)
    }

    static chain(f) {
        return maybe => maybe.chain(f)
    }

    static join(maybe) {
        return maybe.join()
    }

    static sequence(maybe) {
        return maybe.sequence()
    }
}

class Just {
    constructor(val) {
        this.__value = val
        this.__name  = "Just"
    }

    fmap(f) {
        return new Just(f(this.__value))
    }

    ap(maybe) {
        return maybe.fmap(this.__value)
    }

    join() {
        return this.__value
    }

    chain(f) {
        return this.fmap(f).join()
    }

    sequence() {
        return this.__value.fmap(Maybe.pure)
    }
}

class Nothing {
    constructor() {
        this.__name = "Nothing"
    }

    fmap(f) {
        return new Nothing()
    }

    ap(maybe) {
        return new Nothing()
    }

    join() {
        return new Nothing()
    }

    chain(f) {
        return new Nothing()
    }

    sequence() {
        return AsyncIO.pure(Maybe.nothing())
    }
}

// AsyncIO Maybe
export class MaybeA {
    constructor(val) {
        this.__value = val
        this.__name  = "MaybeA"
    }

    static of(fpse) {
        return new MaybeA(AsyncIO.of(fpse))
    }

    static pure(val) {
        return new MaybeA(AsyncIO.pure(val).fmap(Maybe.pure))
    }

    static runMaybeA(maybeA) {
        return maybeA.runMaybeA()
    }

    static fmap(f) {
        return maybeA => maybeA.fmap(f)
    }

    fmap(f) {
        return new MaybeA(this.__value.fmap(Maybe.fmap(f)))
    }

    ap(maybeA) {
        return new MaybeA(this.__value
            .fmap(Maybe.ap)
            .ap(maybeA.__value)
        )
    }
    
    join() {
        return new MaybeA(this.__value
            .fmap(Maybe.fmap(MaybeA.runMaybeA))
            .fmap(Maybe.sequence)
            .join()
            .fmap(Maybe.join)
        )
    }

    chain(f) {
        return this.fmap(f).join()
    }

    runMaybeA() {
        return this.__value
    }
}
