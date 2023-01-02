import { makeObservable } from "mobx";
import { Store } from "..";
import { BaseMxObject } from "./BaseMxObject";

export class RowMxObject extends BaseMxObject {
    /**
     *
     * @param guid mxobj guid
     * @param idx option index
     */
    constructor(private store: Store, guid: string) {
        super(guid);
        makeObservable(this, {});
        this.update();
        this.onChange = () => {
            this.update();
        };
    }
    update() {
        if (this.mxObject) {
            this.store.rows = [...this.store.rows];
        }
    }
}
