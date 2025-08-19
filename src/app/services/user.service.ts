import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { gql } from 'apollo-angular';

export const GET_ALL_USERS = gql`
  query {
    getAllUsers {
      data {
        id
        username
        isAdmin
        member {
          id
          name
          email
          phone
        }
      }
      message
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($userDto: UserDtoInput!) {
    createUser(userDto: $userDto) {
      data {
        id
        username
        isAdmin
      }
      message
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apollo: Apollo) { }

  createUser(userDto: any) {
    return this.apollo.mutate({
      mutation: CREATE_USER,
      variables: {
        userDto: userDto
      }
    });
  }

  //  createUser(userData: { fullName: string; email: string; password: string; phoneNumber: string }) {
  //   const CREATE_USER = gql`
  //     mutation CreateUser($fullName: String!, $email: String!, $password: String!, $phoneNumber: String!) {
  //       createUser(fullName: $fullName, email: $email, password: $password, phoneNumber: $phoneNumber) {
  //         id
  //         fullName
  //         email
  //         password
  //         phoneNumber
  //       }
  //    }
  //  `;
  //   return this.apollo.mutate({
  //     mutation: CREATE_USER,
  //     variables: {
  //       fullName: userData.fullName,
  //       email: userData.email,
  //       password: userData.password,
  //       phoneNumber: userData.phoneNumber
  //     }
  //   });
  // }

  getAllUsers(): Observable<any[]> {
    return this.apollo.watchQuery({
      query: GET_ALL_USERS
    }).valueChanges.pipe(
      map((result: any) => {
        return result?.data?.getAllUsers?.data ?? [];
      })
    );
  }

  deleteUser(userId: number) {
    return this.apollo.mutate({
      mutation: gql`
      mutation deleteUser($id: Long!) {
        deleteUser(id: $id) {
          status
          message
        }
      }
    `,
      variables: {
        id: userId
      }
    });
  }
}

