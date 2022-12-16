import { createElement, useEffect, useMemo } from "react";

import { ProTableContainerProps } from "../typings/ProTableProps";

import "./ui/index.scss";

import { Observer } from "mobx-react";
import { Store } from "./store";
import { useUnmount } from "ahooks";
import Demo from "./components/demo";

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
    const store = useMemo(() => new Store(props), []);

    useEffect(() => {
        store.mxOption = props;
        return () => {};
    }, [store, props]);

    useUnmount(() => {
        store.dispose();
    });

    return (
        <Observer>
            {() => (
                <div className={props.class} style={parseStyle(props.style)}>
                    <Demo></Demo>
                </div>
            )}
        </Observer>
    );
}
