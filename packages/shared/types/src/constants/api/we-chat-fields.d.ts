import { ApiWeChatUpload, WeChatBaseFields, WeChatCreateFields } from "/#/api/blog/money/we-chat";
import { FieldConfig } from "/#/api/common";
export declare const weChatBaseFieldsMap: Record<keyof WeChatBaseFields, FieldConfig>;
export declare const weChatCreateFieldsMap: Record<keyof WeChatCreateFields, FieldConfig>;
export declare const weChatUploadFieldsMap: Record<keyof ApiWeChatUpload, FieldConfig>;
export declare const weChatUploadFields: {
    key: keyof ApiWeChatUpload;
    label: string;
    type: "string" | "number" | "date";
}[];
//# sourceMappingURL=we-chat-fields.d.ts.map