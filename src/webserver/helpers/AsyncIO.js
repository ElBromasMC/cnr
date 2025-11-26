
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

    concat(asyncIO) {
        return this.chain(() => asyncIO)
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

    joinM() {
        return this
            .fmap(MaybeA.runMaybeA)
            .sequence()
            .fmap(Maybe.join)
            .toMaybeA()
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

    joinM() {
        return this
            .fmap(MaybeA.runMaybeA)
            .sequence()
            .fmap(Maybe.join)
            .toMaybeA()
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
    
    static joinM(maybe) {
        return maybe.joinM()
    }

    static guard(bool) {
        return bool ? MaybeA.pure(0) : new MaybeA(AsyncIO.pure(Maybe.nothing()))
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

    concat(maybeA) {
        return this.chain(() => maybeA)
    }

    fromPromise(f, g) {
        this.__value.resolve().then(x => {
            if (Maybe.isJust(x)) {
                f(x.__value)
            } else {
                g()
            }
        })
    }

    runMaybeA() {
        return this.__value
    }
}

const id = x => x

export class ListM {
    constructor(val) {
        this.__value = val
        this.__name  = "ListM"
    }

    static of(val) {
        return new ListM(val)
    }

    static empty() {
        return new ListM([])
    }

    static pure(val) {
        return new ListM([val])
    }

    static fmap(f) {
        return listM => listM.fmap(f)
    }


    static sequence(listM) {
        return listM.sequence()
    }

    static append(val) {
        return listM => listM.append(val)
    }

    static toList(listM) {
        return listM.toList()
    }

    static guard(bool) {
        return bool ? ListM.pure(0) : ListM.empty()
    }

    static range(start, stop) {
        return ListM.of(Array.from(
            { length: (stop - start) + 1 },
            (value, index) => start + index
            ))
    }

    isEmpty() {
        return this.__value.length === 0
    }

    append(val) {
        return new ListM([val, ...this.__value])
    }

    fmap(f) {
        return new ListM(this.__value.map(f))
    }

    ap(listM) {
        return listM.fmap(this.__value)
    }

    join() {
        return new ListM(this.__value.map(e => e.__value).flatMap(id))
    }

    chain(f) {
        return this.fmap(f).join()
    }

    concat(listM) {
        return this.chain(() => listM)
    }

    plus(listM) {
        return new ListM(this.__value.concat(listM.__value))
    }

    toList() {
        return this.__value
    }

    head() {
        const [h] = this.__value
        return h
    }

    tail() {
        const [, ...t] = this.__value
        return new ListM(t)
    }

    sequence() {
        if (this.isEmpty()) {
            return AsyncIO.pure(ListM.empty())
        } else {
            return AsyncIO.pure(ListM.append).ap(this.head()).ap(this.tail().sequence())
        }
    }

}
