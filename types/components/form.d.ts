export interface FormSchema {
  field: string;
  label: string;
  labelMessage?: string;
  labelMessageStyle?: string;
  defaultValue?: any;
  component?: ComponentType;
  componentProps?: FormSchemaComponentProps;
  slot?: string;
  rules?: FormRules;
  giProps?: GridItemProps;
  isFull?: boolean;
  suffix?: string;
  labelWidth?: number | string;
}

export interface FormSchemaComponentProps {
  filterable?: boolean;
  clearable?: boolean;
  placeholder?: string;
  options?: CStrOption[] | CNumOption[];
  'onUpdate:value'?: (val?) => void;
}

export interface SearchFormProps {
  labelWidth?: number | string;
  schemas?: FormSchema[];
  inline: boolean;
  size: string;
  labelPlacement: string;
}

export interface ModelFormProps {
  labelWidth?: number | string;
  schemas?: FormSchema[];
  size: string;
  labelPlacement: string;
  rules?: FormRules;
}

export interface FormActionType {
  submit: () => Promise<any>;
  setFieldsValue: <T>(values: T) => Promise<void>;
  clearValidate: (name?: string | string[]) => Promise<void>;
  getFieldsValue: () => Recordable;
  resetFields: () => Promise<void>;
  validate: (nameList?: any[]) => Promise<any>;
}

export type ComponentType =
  | 'NInput'
  | 'NInputGroup'
  | 'NInputPassword'
  | 'NInputSearch'
  | 'NInputTextArea'
  | 'NInputNumber'
  | 'NInputCountDown'
  | 'NSelect'
  | 'NTreeSelect'
  | 'NRadioButtonGroup'
  | 'NRadioGroup'
  | 'NCheckbox'
  | 'NCheckboxGroup'
  | 'NAutoComplete'
  | 'NCascader'
  | 'NDatePicker'
  | 'NMonthPicker'
  | 'NRangePicker'
  | 'NWeekPicker'
  | 'NTimePicker'
  | 'NSwitch'
  | 'NStrengthMeter'
  | 'NUpload'
  | 'NIconPicker'
  | 'NRender'
  | 'NSlider'
  | 'NRate';
