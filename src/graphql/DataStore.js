/**
 * Help process graphql request (header, ...)
 * 1. token -> header (Authorization)
 */
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';

import { useRoleContext } from '../context/RoleContext';

const Store = ({ children }) => {
	const { getAccessTokenSilently } = useAuth0();
	const { currentRole } = useRoleContext();

	const httpLink = new HttpLink({
		uri: process.env.REACT_APP_GRAPHQL_URL
	});

	const request = async (operation) => {
		const token = await getAccessTokenSilently();
		operation.setContext({
			headers: {
				authorization: `Bearer ${token}`,
				'X-Hasura-Role': currentRole
			}
		});
	};

	const requestLink = new ApolloLink(
		(operation, forward) =>
			new Observable((observer) => {
				let handle;
				Promise.resolve(operation)
					.then((oper) => request(oper))
					.then(() => {
						handle = forward(operation).subscribe({
							next: observer.next.bind(observer),
							error: observer.error.bind(observer),
							complete: observer.complete.bind(observer)
						});
					})
					.catch(observer.error.bind(observer));

				return () => {
					if (handle) handle.unsubscribe();
				};
			})
	);

	const apolloClient = new ApolloClient({
		link: ApolloLink.from([
			onError(({ graphQLErrors, networkError }) => {
				if (graphQLErrors)
					graphQLErrors.forEach(({ message, locations, path }) =>
						console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
					);
				if (networkError) console.log(`[Network error]: ${networkError}`);
			}),
			requestLink,
			httpLink
		]),
		cache: new InMemoryCache(),
		connectToDevTools: true
	});

	return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

export default Store;
