/**
 * Return the component if authenticated, else nothing or redirect to login page
 */

import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const WithProtectedPage = (Component) => {
	return function Wrapped() {
		const { isAuthenticated } = useAuth0();

		//change this to isAuthenticated, remove all temp data
		if (isAuthenticated) {
			return <Component />;
		}

		return <div>You need to log in</div>;
	};
};

export default WithProtectedPage;
