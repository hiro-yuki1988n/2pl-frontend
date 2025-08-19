import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { gql } from 'apollo-angular';

export const GET_COMMON_FUNDS = gql`
  query {
    getCommonFunds {
      data {
        id
        amount
        sourceType
        entryDate
        description
      }
      message
      status
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class CommonFundService {

  constructor(private apollo: Apollo) { }

  saveCommonFund(fundData: any) {
    const SAVE_COMMON_FUND = gql`
          mutation saveCommonFund($commonFundDto: CommonFundDtoInput!) { 
            saveCommonFund(commonFundDto: $commonFundDto) {
              data {
                id
                amount
                sourceType
                entryDate
                description
              }
            }
          }
        `;
    return this.apollo.mutate({
      mutation: SAVE_COMMON_FUND,
      variables: {
        commonFundDto: fundData
      }
    });
  }

  getCommonFunds(): Observable<any[]> {
    return this.apollo.watchQuery({
      query: GET_COMMON_FUNDS
    }).valueChanges.pipe(
      map((result: any) => {
        return result?.data?.getCommonFunds?.data ?? [];
      })
    );
  }

  deleteCommonFund(commonFundId: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation deleteCommonFund($id: Long!) {
          deleteCommonFund(id: $id) {
            status
            message
          }
        }
      `,
      variables: {
        id: commonFundId
      }
    });
  }
}
