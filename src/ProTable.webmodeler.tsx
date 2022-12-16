import { Component, ReactNode, createElement } from "react";
import { ProTableContainerProps, ProTablePreviewProps } from "../typings/ProTableProps";

declare function require(name: string): string;

export class preview extends Component<ProTablePreviewProps> {
    render(): ReactNode {
        return <div>No preview available</div>;
    }
}

export function getPreviewCss(): string {
    return require("./ui/index.scss");
}
type VisibilityMap = {
    [P in keyof ProTableContainerProps]: boolean;
};

export function getVisibleProperties(props: ProTableContainerProps, visibilityMap: VisibilityMap): VisibilityMap {
    // visibilityMap.nodeConstraint = props.nodeDataSource === "xpath";
    // visibilityMap.nodeGetDataMicroflow = props.nodeDataSource === "microflow";
    // visibilityMap.nodeGetDataNanoflow = props.nodeDataSource === "nanoflow";
    console.log(props);

    return visibilityMap;
}
