import { createElement, useEffect, useMemo, useState } from "react";

import { ProTableContainerProps } from "../typings/ProTableProps";

import "./ui/index.scss";

import { Observer } from "mobx-react";
import { Store } from "./store";
import { useUnmount } from "ahooks";
import { EditableProTable } from "@ant-design/pro-components";

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
                                    record: () => ({ guid: (Math.random() * 1000000).toFixed(0) })
                                }
                                : false
                        }
                        loading={false}
                        columns={store.columnHeads.concat({
                            title: "操作",
                            valueType: "option",
                            width: 200,
                            render: (_text: any, record: any, _: any, action: any) => [
                                <a
                                    key="editable"
                                    onClick={() => {
                                        action?.startEditable?.(record.guid);
                                    }}
                                >
                                    编辑
                                </a>,
                                <a
                                    key="delete"
                                    onClick={() => {
                                        // setDataSource(dataSource.filter(item => item.id !== record.id));
                                    }}
                                >
                                    删除
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
                            },
                            onChange: setEditableRowKeys
                        }}
                    />
                </div>
            )}
        </Observer>
    );
}
