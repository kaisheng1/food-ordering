import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Auth0Provider } from '@auth0/auth0-react';

import App from './App';
import DataStore from './graphql/DataStore';
import { RoleContextProvider } from './context/RoleContext';
import { CartContextProvider } from './context/CartContext';

ReactDOM.render(
	<React.Fragment>
		<CssBaseline />
		<Auth0Provider
			domain={process.env.REACT_APP_AUTH_DOMAIN}
			clientId={process.env.REACT_APP_AUTH_CLIENT}
			redirectUri={process.env.REACT_APP_AUTH_REDIRECT}
			audience={process.env.REACT_APP_AUTH_AUDIENCE}
		>
			<RoleContextProvider>
				<DataStore>
					<CartContextProvider>
						<App />
					</CartContextProvider>
				</DataStore>
			</RoleContextProvider>
		</Auth0Provider>
	</React.Fragment>,
	document.getElementById('root')
);
