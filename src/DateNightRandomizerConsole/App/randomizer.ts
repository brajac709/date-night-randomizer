import { isNullOrUndefined } from "util";

export class Randomizer<T> {
    private data: T[]

    constructor(data: T[] = null) {
        this.data = data;
    }

    pick() {
        if (isNullOrUndefined(this.data) || this.data.length == 0)
        {
            return null;
        }
        const idx = Math.floor(Math.random() * this.data.length);
        const retVal = this.data[idx];
        this.data.splice(idx, 1);

        return retVal;
    }
}