import React from 'react';

import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'

import UploadForm from './UploadForm'

const client = new ApolloClient({
  link: createUploadLink({
    uri: 'http://localhost:4000/graphql',
  }),
  cache: new InMemoryCache(),
})

function App() {
  try {
    return (<ApolloProvider client = {client}>
      <UploadForm />
    </ApolloProvider>
    );
  } catch (err) {
    throw Error(err)
  }
}

export default App;
