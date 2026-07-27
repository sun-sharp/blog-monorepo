import { AliPayBaseFields, AliPayCreateFields, ApiAliPayUpload } from "/#/api/blog/money/ali-pay";
import { FieldConfig } from "/#/api/common";
export declare const aliPayBaseFieldsMap: Record<keyof AliPayBaseFields, FieldConfig>;
export declare const aliPayCreateFieldsMap: Record<keyof AliPayCreateFields, FieldConfig>;
export declare const aliPayUploadFieldsMap: Record<keyof ApiAliPayUpload, FieldConfig>;
export declare const aliPayUploadFields: {
    key: keyof ApiAliPayUpload;
    label: string;
    type: "string" | "number" | "date";
}[];
//# sourceMappingURL=ali-pay-fields.d.ts.map