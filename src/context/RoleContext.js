import React, { createContext, useContext, useState } from 'react';

export const RoleContext = createContext();

const roles = new Set([ 'customer', 'restaurant_manager', 'driver' ]);

const getRole = () => {
	const item = localStorage.getItem('role');
	if (item && roles.has(item)) return item;
	return 'customer';
};

const setRole = (role) => {
	localStorage.setItem('role', role);
};

const removeRole = () => {
	localStorage.removeItem('role');
};

export const RoleContextProvider = ({ children }) => {
	const [ currentRole, setCurrentRole ] = useState(getRole());

	const updateRole = (role) => {
		if (roles.has(role)) {
			setCurrentRole(role);
			setRole(role);
		}
	};

	const clear = () => {
		removeRole();
	};

	const value = {
		roles: [ ...roles ],
		currentRole,
		updateRole,
		clear
	};

	return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRoleContext = () => useContext(RoleContext);
