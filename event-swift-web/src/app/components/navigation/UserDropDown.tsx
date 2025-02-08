import { Dropdown, Button, Avatar, Badge } from '@rewind-ui/core';
import { useAuth } from '../../../hooks/use-auth';
import Link from 'next/link';

const UserDropDown = () => {
    const { user, signOut } = useAuth();
    
  return (
    <Dropdown chevronRotation={false} withChevron={false}>
      <Dropdown.Trigger>
        <Avatar>
          Profile
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>
            <Link href='/dashboard'>
            Profile
            </Link>
            </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>
          Settings
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>
          <Badge
            onClick={ signOut }
            variant='danger'
            tone='outline'
          >
            Logout
            </Badge>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );
}

export default UserDropDown;