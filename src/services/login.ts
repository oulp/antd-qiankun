import gql from 'graphql-tag';
import { query } from '@/utils/graphql';

export interface LoginParamsType {
  username: string;
  password: string;
}

const user = `
  {
    id,
    username,
    displayName,
    baseInfo{contact{phone}},
    organization{id,name}
  }`;

const userWithAuthToken = `
  {
    user ${user},
    authToken,
    isCodeAuthed,
    codeToken
  }`;

export async function login(payload: LoginParamsType) {
  return query(
    gql`query($username: Username!, $password: Password!, $codeToken: String){
      payload: login(username: $username, password: $password, codeToken: $codeToken)
      ${userWithAuthToken}
   }`,
    {
      variables: {
        username: payload.username,
        password: payload.password,
      },
    },
  );
}
