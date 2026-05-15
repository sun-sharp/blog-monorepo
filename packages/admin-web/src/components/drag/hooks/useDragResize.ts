export const DragProps = {
  width: {
    type: Number,
    default: 100,
  },
  height: {
    type: Number,
    default: 100,
  },
  left: {
    type: Number,
    default: 0,
  },
  top: {
    type: Number,
    default: 0,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  minWidth: {
    type: Number,
    default: -Infinity,
  },
  minHeight: {
    type: Number,
    default: -Infinity,
  },
  hasSpace: {
    type: Boolean,
    default: false,
  },
};
