import { action, autorun, configure, makeObservable, observable, runInAction, when } from "mobx";
import { ProTableContainerProps } from "../../typings/ProTableProps";
import { RowMxObject } from "./objects/RowMxObject";
import { commitObject, createObject } from "@jeltemx/mendix-react-widget-utils";

configure({ enforceActions: "observed", isolateGlobalState: true, useProxies: "never" });

export class Store {
    rows: RowMxObject[] = [];
    sub?: mx.Subscription;
    columnHeads: any[];
    data: any[] = [];
    /**
     * dispose
     */
    public dispose() {}

    constructor(public mxOption: ProTableContainerProps) {
        makeObservable(this, {
            rows: observable,
            data: observable,
            columnHeads: observable,
            saveRow: action
        });

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
            this.data = this.rows.map(row => {
                const d: any = { guid: row.guid };
                for (const column of mxOption.columns) {
                    d[column.columnAttribute] = row.mxObject?.get(column.columnAttribute);
                }
                return d;
            });
        });

        this.columnHeads = mxOption.columns.map(d => {
            const valueType = attr2type(mxOption.nodeEntity, d.columnAttribute);
            const columnHead: any = {
                title: d.columnTitle,
                dataIndex: d.columnAttribute,
                valueType
            };
            if (valueType == "select") {
                const valueEnum: any = {};
                mx.meta
                    .getEntity(mxOption.nodeEntity)
                    .getEnumMap(d.columnAttribute)
                    .forEach(d2 => {
                        valueEnum[d2.key] = { text: d2.caption, status: d2.key };
                    });
                columnHead.valueEnum = valueEnum;
            }
            return columnHead;
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

    saveRow(jsonObj: any) {
        if (typeof jsonObj.guid == "number") {
            //new
            createObject(this.mxOption.nodeEntity).then(newMxObj => {
                if (newMxObj) {
                    this._doCommit(newMxObj, jsonObj);
                }
            });
        } else {
            //update
            this._doCommit(mx.data.getCachedObject(jsonObj.guid), jsonObj);
        }
    }

    private _doCommit(newMxObj: mendix.lib.MxObject, jsonObj: any) {
        newMxObj.getAttributes().forEach(value => {
            if (value in jsonObj) {
                newMxObj.set(value, jsonObj[value]);
            }
        });

        commitObject(newMxObj).then(() => {
            runInAction(() => {
                this.data.push(newMxObj);
            });
        });
    }
}

/**
 * https://procomponents.ant.design/components/schema#valuetype-%E5%88%97%E8%A1%A8
 * @param nodeEntity
 * @param columnAttribute
 */
function attr2type(nodeEntity: any, columnAttribute: string): any {
    //"Enum" | "EnumSet" | "Integer" | "Long" | "Decimal" | "Float" | "Currency" | "HashString" | "Date" | "DateTime" | "Boolean" | "ObjectReference" | "ObjectReferenceSet" | "ObjectReference" | "ObjectReferenceSet"
    const mxType = mx.meta.getEntity(nodeEntity).getAttributeType(columnAttribute);
    let result = "text";

    //TODO 实例其它类型映射
    switch (mxType) {
        case "DateTime":
            result = "datetime";
            break;
        case "Date":
            result = "date";
            break;
        case "Enum":
            result = "select";
            break;
        default:
            break;
    }
    return result;
}
