import { ApiBankUpload, BankBaseFields, BankCreateFields } from "/#/api/blog/money/bank";
import { FieldConfig } from "/#/api/common";
export declare const bankBaseFieldsMap: Record<keyof BankBaseFields, FieldConfig>;
export declare const bankCreateFieldsMap: Record<keyof BankCreateFields, FieldConfig>;
export declare const bankUploadFieldsMap: Record<keyof ApiBankUpload, FieldConfig>;
export declare const bankUploadFields: {
    key: keyof ApiBankUpload;
    label: string;
    type: "string" | "number" | "date";
}[];
//# sourceMappingURL=bank-fields.d.ts.map