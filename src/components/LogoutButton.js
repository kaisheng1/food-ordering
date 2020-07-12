import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '@material-ui/core/Button';
import { useRoleContext } from '../context/RoleContext';

const LogoutButton = (props) => {
	const { logout } = useAuth0();
	const { clear } = useRoleContext();

	const handleLogout = async () => {
		await clear();
		await logout({ returnTo: process.env.REACT_APP_AUTH_REDIRECT });
	};

	return (
		<Button {...props} onClick={handleLogout}>
			Logout
		</Button>
	);
};

export default LogoutButton;
