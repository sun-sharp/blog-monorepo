import { LockOutlined } from '@ant-design/icons';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const LockIcon = (props: Partial<CustomIconComponentProps>) => <LockOutlined style={{ fontSize: '14px', color: '#faad14', marginLeft: '8px' }} {...props} />;

export default LockIcon;
