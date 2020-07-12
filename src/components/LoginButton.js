import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '@material-ui/core/Button';
import { useRoleContext } from '../context/RoleContext';

const formatRole = (role) => role.replace('_', ' ');

const LoginButton = ({ role, ...props }) => {
	const { loginWithRedirect } = useAuth0();
	const { updateRole } = useRoleContext();

	const handleLogin = async () => {
		await updateRole(role);
		await loginWithRedirect();
	};

	return (
		<Button {...props} onClick={handleLogin}>
			{`Login as ${formatRole(role)}`}
		</Button>
	);
};

export default LoginButton;
