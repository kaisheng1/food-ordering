import React, { useState } from 'react';
import { Select, MenuItem, AppBar, makeStyles, Container } from '@material-ui/core';
import { useAuth0 } from '@auth0/auth0-react';

import Home from './pages/Home';
import Order from './pages/Order';
import Setting from './pages/Setting';

import CartModal from './components/modals/CartModal';
import LoginModal from './components/modals/LoginModal';
import LogoutButton from './components/LogoutButton';
import { useRoleContext } from './context/RoleContext';

const useStyles = makeStyles((theme) => ({
	appbar: {
		display: 'flex',
		justifyContent: 'space-between',
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(1)
	},
	content: {
		padding: theme.spacing(2)
	}
}));

const SwitchPage = ({ page }) => {
	switch (page) {
		case 'Home':
			return <Home />;
		case 'Order':
			return <Order />;
		case 'Setting':
			return <Setting />;
		default:
			throw new Error('Invalid page');
	}
};

function App() {
	const [ page, setPage ] = useState('Home');
	const { isAuthenticated } = useAuth0();
	const { currentRole } = useRoleContext();
	const classes = useStyles();

	const handleSelectChange = (e) => {
		setPage(e.target.value);
	};

	return (
		<React.Fragment>
			<AppBar position="sticky">
				<Container maxWidth="md" className={classes.appbar}>
					<Select onChange={handleSelectChange} value={page}>
						{[ 'Home', 'Order', 'Setting' ].map((page) => {
							return (
								<MenuItem key={page} value={page}>
									{page}
								</MenuItem>
							);
						})}
					</Select>
					{isAuthenticated && currentRole === 'customer' && <CartModal />}
					{isAuthenticated ? <LogoutButton color="inherit" /> : <LoginModal color="inherit" />}
				</Container>
			</AppBar>
			<Container maxWidth="md" className={classes.content}>
				<SwitchPage page={page} />
			</Container>
		</React.Fragment>
	);
}

export default App;
