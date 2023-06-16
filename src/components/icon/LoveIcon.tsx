import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const IconSvg = () => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
    <path d="M535.9 216.7l-22.9 23-22.9-23.1c-89.2-89.7-234.3-90.1-323.9-0.8l-0.8 0.8c-89.7 90.1-89.7 235.8 0 326L476 859.3c20.1 20.4 52.9 20.7 73.4 0.7l0.7-0.7 310.7-316.7c89.7-90.1 89.7-235.8 0-326-89.2-89.7-234.3-90.1-323.9-0.9l-1 1z"></path>
  </svg>
);

const LoveIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={IconSvg} style={{ fontSize: '14px' }} {...props} />;
export default LoveIcon;
