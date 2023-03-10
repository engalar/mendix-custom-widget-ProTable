import { createElement, useEffect, useMemo, useState } from "react";

import { ProTableContainerProps } from "../typings/ProTableProps";

import "./ui/index.scss";

import { Observer } from "mobx-react";
import { Store } from "./store";
import { useUnmount } from "ahooks";
import { EditableProTable } from "@ant-design/pro-components";
import { deleteObjectGuid } from "@jeltemx/mendix-react-widget-utils";
import { runInAction } from "mobx";

const parseStyle = (style = ""): { [key: string]: string } => {
    try {
        return style.split(";").reduce<{ [key: string]: string }>((styleObject, line) => {
            const pair = line.split(":");
            if (pair.length === 2) {
                const name = pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase());
                styleObject[name] = pair[1].trim();
            }
            return styleObject;
        }, {});
    } catch (_) {
        return {};
    }
};

export default function ProTable(props: ProTableContainerProps) {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

    const [position, _setPosition] = useState<"top" | "bottom" | "hidden">("top");

    const store = useMemo(() => new Store(props), []);

    useEffect(() => {
        store.mxOption = props;
        return () => { };
    }, [store, props]);

    useUnmount(() => {
        store.dispose();
    });

    return (
        <Observer>
            {() => (
                <div className={props.class} style={parseStyle(props.style)}>
                    <EditableProTable<any>
                        rowKey="guid"
                        maxLength={5}
                        scroll={{
                            x: 960
                        }}
                        recordCreatorProps={
                            position !== "hidden"
                                ? {
                                    position: position as "top",
                                    record: () => ({ guid: Math.random() })
                                }
                                : false
                        }
                        loading={false}
                        columns={store.columnHeads.concat({
                            title: "??????",
                            valueType: "option",
                            width: 200,
                            render: (_text: any, record: any, _: any, action: any) => [
                                <a
                                    key="editable"
                                    onClick={() => {
                                        action?.startEditable?.(record.guid);
                                    }}
                                >
                                    ??????
                                </a>,
                                <a
                                    key="delete"
                                    onClick={() => {
                                        const idx = store.data.indexOf(record)
                                        deleteObjectGuid(record.guid).then(msg => {
                                            console.log(msg);
                                            runInAction(() => {
                                                store.rows.splice(idx, 1);
                                            });
                                        })
                                    }}
                                >
                                    ??????
                                </a>
                            ]
                        })}
                        value={store.data}
                        onChange={(value) => {
                            console.log(value);
                        }}
                        editable={{
                            type: "multiple",
                            editableKeys,
                            onSave: async (rowKey, data, row) => {
                                console.log(rowKey, data, row);
                                store.saveRow(data);
                            },
                            onChange: setEditableRowKeys
                        }}
                    />
                </div>
            )}
        </Observer>
    );
}
