/**
 * This file was generated from ProTable.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Team
 */
import { CSSProperties } from "react";
import { ActionPreview } from "@mendix/pluggable-widgets-typing-generator/dist/typings";
import { EditableValue } from "mendix";

interface CommonProps {
    name: string;
    class: string;
    tabIndex: number;

    uniqueid: string;
    friendlyId?: string;
    mxform: mxui.lib.form._FormBase;
    mxObject?: mendix.lib.MxObject;
    readOnly: boolean;
    style: string;
}

export type NodeDataSourceEnum = "xpath" | "microflow" | "nanoflow";

export interface ColumnsType {
    columnTitle: string;
    columnAttribute: EditableValue<string | boolean | Date>;
}

export interface ColumnsPreviewType {
    columnTitle: string;
    columnAttribute: string;
}

export interface ColumnsVisibilityType {
    columnTitle: boolean;
    columnAttribute: boolean;
}

export interface ProTableContainerProps extends CommonProps {
    nodeEntity: any;
    nodeDataSource: NodeDataSourceEnum;
    nodeConstraint?: any;
    nodeGetDataMicroflow?: any;
    nodeGetDataNanoflow?: any;
    columns: ColumnsType[];
}

export interface ProTablePreviewProps {
    class: string;
    style: string;
    styleObject: CSSProperties;
    nodeEntity: any;
    nodeDataSource: NodeDataSourceEnum;
    nodeConstraint?: any;
    nodeGetDataMicroflow?: any;
    nodeGetDataNanoflow?: any;
    columns: ColumnsPreviewType[];
}

export interface VisibilityMap {
    nodeEntity: boolean;
    nodeDataSource: boolean;
    nodeConstraint: boolean;
    nodeGetDataMicroflow: boolean;
    nodeGetDataNanoflow: boolean;
    columns: ColumnsVisibilityType[] | boolean;
}
