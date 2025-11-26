
export class MonPromise {
    constructor(promise) {
        this.__value = promise
    }

    async fromPromise(resolve, reject) {
        const value = await this.__value()
        if (value === null) {
            reject()
        } else {
            resolve(value)
        }
    }

    static of(promise) {
        return new MonPromise(promise)
    }

    static pure(value) {
        return new MonPromise(() => {
            return Promise.resolve(value)
        })
    }

    fmap(f) {
        return MonPromise.of(async () => {
            try {
                const value = await this.__value()
                return value === null ? null : f(value)
            } catch {
                return null
            }
        })
    }

    ap(monPromise) {
        return MonPromise.of(async () => {
            try {
                const [f, value] = await Promise.all([this.__value(), monPromise.__value()])
                if (f === null || value === null) {
                    return null
                }
                return f(value)
            } catch {
                return null
            }
        })
    }

    join() {
        return MonPromise.of(async () => {
            try {
                const value = await this.__value()
                return value === null ? null : await value.__value()
            } catch {
                return null
            }
        })
    }

    chain(f) {
        return this.fmap(f).join()
    }

}


