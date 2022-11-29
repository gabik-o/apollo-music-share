import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import { gql } from "@apollo/client";
import { GET_QUEUED_SONGS } from "./queries";

function getHeaders() {
  const headers = {};
  const token = process.env.REACT_APP_API_KEY;
  if (token) {
    headers["x-hasura-admin-secret"] = `${token}`;
  }
  return headers;
}
const httpLink = new HttpLink({
  uri: "https://fast-rattler-99.hasura.app/v1/graphql",
  fetch: (uri, options) => {
    options.headers = getHeaders();
    return fetch(uri, options);
  },
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: "wss://fast-rattler-99.hasura.app/v1/graphql",
  options: {
    reconnect: true,
    lazy: true,
    timeout: 30000,
    inactivityTimeout: 30000,
    connectionParams: () => {
      return { headers: getHeaders() };
    },
  },
});

const errorLink = onError((error) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(error);
  }
});

const cache = new InMemoryCache();
const client = new ApolloClient({
  cache,
  typeDefs: gql`
    type Song {
      id: uuid!
      title: String!
      artist: String!
      thumbnail: String!
      duration: Float!
      url: String!
    }

    type Query {
      queue: [Song]!
    }

    input SongInput {
      id: uuid!
      title: String!
      artist: String!
      thumbnail: String!
      duration: Float!
      url: String!
    }

    type Mutation {
      addOrRemoveFromQueue(input: SongInput!): [Song]!
    }
  `,
  resolvers: {
    Mutation: {
      addOrRemoveFromQueue: (_, { input }, { cache }) => {
        const queryResult = cache.readQuery({
          query: GET_QUEUED_SONGS,
        });
        if (queryResult) {
          const { queue } = queryResult;
          const isInQueue = queue.some((song) => song.id === input.id);
          const newQueue = isInQueue
            ? queue.filter((song) => song.id !== input.id)
            : [...queue, input];
          cache.writeQuery({
            query: GET_QUEUED_SONGS,
            data: { queue: newQueue },
          });
          return newQueue;
        }
        return [];
      },
    },
  },
  link: errorLink.concat(
    split(
      // split based on operation type
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    )
  ),
});

const hasQueue = Boolean(localStorage.getItem("queue"));

const data = {
  queue: hasQueue ? JSON.parse(localStorage.getItem("queue")) : [],
};

client.writeQuery({
  query: GET_QUEUED_SONGS,
  data,
});

export default client;
