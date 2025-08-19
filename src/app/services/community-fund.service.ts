import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CommunityFundService {

  constructor(private apollo: Apollo) { }

  // saveSocialFund(fund: any) {
  //   const SAVE_SOCIAL_FUND = gql`
  //     mutation SaveSocialFund($socialFundDto: SocialFundDtoInput!) {
  //       saveSocialFund(socialFundDto: $socialFundDto) {
  //         data {
  //           id
  //           amount
  //           paymentDate
  //           month
  //         }
  //       }
  //     }
  //   `;

  //   return this.apollo.mutate({
  //     mutation: SAVE_SOCIAL_FUND,
  //     variables: {
  //       socialFundDto: fund
  //     }
  //   });
  // }

  // saveSocialFund(saveSocialFundData: any) {
  //   const SAVE_SOCIAL_FUND = gql`
  //       mutation saveSocialFund($socialFundDto: SocialFundDtoInput!) {
  //         saveSocialFund(socialFundDto: $socialFundDto) {
  //           data {
  //             id
  //           amount
  //           paymentDate
  //           month
  //           }
  //         }
  //       }
  //     `;
  //   return this.apollo.mutate({
  //     mutation: SAVE_SOCIAL_FUND,
  //     variables: {
  //       socialFundDto: saveSocialFundData
  //     }
  //   });
  // }

  saveSocialFund(socialFundData: any) {
    const SAVE_SOCIAL_FUND = gql`
      mutation saveSocialFund($socialFundDto: SocialFundDtoInput!) {
        saveSocialFund(socialFundDto: $socialFundDto) {
          data {
            id
            amount
            paymentDate
            month
          }
        }
      }
    `;

    return this.apollo.mutate({
      mutation: SAVE_SOCIAL_FUND,
      variables: {
        socialFundDto: socialFundData
      }
    });
  }

  getAllSocialFunds(page: number = 0, size: number = 500) {
    const GET_SOCIAL_FUNDS = gql`
  query getAllSocialFunds($pageableParam: PageableParamInput) {
    getAllSocialFunds(pageableParam: $pageableParam) {
      data {
        id
        member{
          name
        }
        amount
        month
        paymentDate
      }
    }
  }
`;
    return this.apollo.watchQuery({
      query: GET_SOCIAL_FUNDS,
      variables: {
        pageableParam: {
          page,
          size
        }
      },
      fetchPolicy: 'network-only'
    }).valueChanges;
  }

  getTotalSocialFundsByMember(memberId: number, year: number) {
    return this.apollo.query({
      query: gql`
        query($memberId: Long!, $year: Int!) {
          getTotalSocialFundsByMember(memberId: $memberId, year: $year) {
            data
          }
        }
      `,
      variables: { memberId, year },
      fetchPolicy: 'no-cache'
    });
  }

  getSocialFundsByMember(memberId: number, year: number, page: number = 0, size: number = 500) {
    const GET_SOCIAL_FUNDS_BY_MEMBER = gql`
      query getSocialFundsByMember($pageableParam: PageableParamInput, $memberId: Long!, $year: Int!) {
        getSocialFundsByMember(pageableParam: $pageableParam, memberId: $memberId, year: $year) {
          data {
            id
            member{
              id
              name
            }
            amount
            paymentDate
            month
          }
        }
      }
    `;
    return this.apollo.watchQuery({
      query: GET_SOCIAL_FUNDS_BY_MEMBER,
      variables: {
        pageableParam: {
          page,
          size
        },
        memberId, year
      },
      fetchPolicy: 'network-only'
    }).valueChanges;
  }

  deleteCommunityFund(communityFundId: number): Observable<any> {
  return this.apollo.mutate({
    mutation: gql`
      mutation DeleteSocialFund($socialFundId: Long!) {
        deleteSocialFund(socialFundId: $socialFundId) {
          status
          message
        }
      }
    `,
    variables: {
      socialFundId: Number(communityFundId)
    }
  });
}
}
