import { fetchByXpath } from "@jeltemx/mendix-react-widget-utils";
import { autorun, configure, makeObservable, observable, when } from "mobx";
import { ProTableContainerProps } from "../../typings/ProTableProps";
import { RowMxObject } from "./objects/RowMxObject";

configure({ enforceActions: "observed", isolateGlobalState: true, useProxies: "never" });

export class Store {
    rows: RowMxObject[] = [];
    sub?: mx.Subscription;
    /**
     * dispose
     */
    public dispose() {}

    constructor(public mxOption: ProTableContainerProps) {
        makeObservable(this, { rows: observable });

        this.update();

        when(
            () => !!this.mxOption.mxObject,
            () => {
                this.update();

                this.sub = mx.data.subscribe(
                    {
                        guid: this.mxOption.mxObject!.getGuid(),
                        callback: () => {
                            this.update();
                            //等待视图刷新
                            setTimeout(() => {
                                this.drawSelection();
                            }, 1);
                        }
                    },
                    //@ts-ignore
                    this.mxOption.mxform
                );
            },
            {
                onError(e) {
                    console.error(e);
                }
            }
        );

        autorun(() => {
            const data = this.rows.map(row => {
                const d: any = {};
                for (const column of mxOption.columns) {
                    d[column.columnAttribute] = row.mxObject?.get(column.columnAttribute);
                }
                return d;
            });

            console.log(data);
        });
    }
    update() {
        if ((this.mxOption.nodeDataSource = "xpath")) {
            this._fetchByXpath();
        } //TODO 其它数据加载方式
    }
    private _fetchByXpath() {
        let nodeConstraint = this.mxOption.nodeConstraint;
        if (this.mxOption.mxObject) {
            nodeConstraint = this.mxOption.nodeConstraint.replace(
                /\[%CurrentObject%]/g,
                this.mxOption.mxObject?.getGuid()
            );
        }

        const getOptions = {
            callback: (objs: any[]) => {
                console.log(objs);
                this.rows = objs.map(d => new RowMxObject(d.getGuid()));
            },
            error: (error: any) => {
                console.error(error);
            },
            xpath: "//" + this.mxOption.nodeEntity + nodeConstraint
        };

        mx.data.get(getOptions);
    }
    drawSelection() {
        throw new Error("Method not implemented.");
    }
}
