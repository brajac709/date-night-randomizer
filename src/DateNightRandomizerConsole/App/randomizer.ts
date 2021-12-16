import { isNullOrUndefined } from "util";

export class Randomizer<T> {
    private data: T[]

    constructor(data: T[] = null) {
        this.data = data;
    }

    pick() {
        return isNullOrUndefined(this.data) ? Math.random() : Math.floor(Math.random() * this.data.length);
    }
}