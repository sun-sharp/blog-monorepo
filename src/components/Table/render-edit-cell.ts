import { h } from 'vue';
import TableEditCell from './table-edit-cell.vue';
import { BasicColumn } from '/#/components/table';

export function renderEditCell(column: BasicColumn) {
  return (record, index) => {
    const _key = column.key;
    const value = record[_key];
    record.onEdit = async (edit: boolean, submit = false) => {
      if (!submit) {
        record.editable = edit;
      }

      if (!edit && submit) {
        const res = await record.onSubmitEdit?.();
        if (res) {
          record.editable = false;
          return true;
        }
        return false;
      }
      // cancel
      if (!edit && !submit) {
        record.onCancelEdit?.();
      }
      return true;
    };
    return h(TableEditCell, {
      value,
      record,
      column,
      index,
    });
  };
}
