import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContributionService {

  constructor(private apollo: Apollo) { }

  saveContribution(contributionData: any) {
    const SAVE_CONTRIBUTION = gql`
        mutation saveContribution($contributionDto: ContributionDtoInput!) { 
          saveContribution(contributionDto: $contributionDto) {
            data {
              id
              amount
              month
              contributionCategory
            }
          }
        }
      `;
    return this.apollo.mutate({
      mutation: SAVE_CONTRIBUTION,
      variables: {
        contributionDto: contributionData
      }
    });
  }

  getContributions(page: number = 0, size: number = 500) {
    const GET_CONTRIBUTIONS = gql`
      query getContributions($pageableParam: PageableParamInput) {
        getContributions(pageableParam: $pageableParam) {
          data {
            id
            member{
              id
              name
            }
            amount
            paymentDate
            month
            penaltyAmount
            year
          }
        }
      }
    `;
    return this.apollo.watchQuery({
      query: GET_CONTRIBUTIONS,
      variables: {
        pageableParam: {
          page,
          size
        }
      },
      fetchPolicy: 'network-only'
    }).valueChanges;
  }

  getTotalMemberContributions(memberId: number, year: number) {
    return this.apollo.query({
      query: gql`
        query($memberId: Long!, $year: Int!) {
          getTotalMemberContributions(memberId: $memberId, year: $year) {
            data
          }
        }
      `,
      variables: { memberId, year },
      fetchPolicy: 'no-cache'
    });
  }

  getContributionsByMember(memberId: number, year: number, page: number = 0, size: number = 500) {
    const GET_CONTRIBUTIONS_BY_MEMBER = gql`
      query getContributionsByMember($pageableParam: PageableParamInput, $memberId: Long!, $year: Int!) {
        getContributionsByMember(pageableParam: $pageableParam, memberId: $memberId, year: $year) {
          data {
            id
            member{
              id
              name
            }
            amount
            paymentDate
            month
            penaltyAmount
            year
          }
        }
      }
    `;
    return this.apollo.watchQuery({
      query: GET_CONTRIBUTIONS_BY_MEMBER,
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

  getLateContributionsByMember(memberId: number, year: number, page: number = 0, size: number = 500) {
    const GET_LATE_CONTRIBUTIONS_BY_MEMBER = gql`
      query getLateContributionsByMember($pageableParam: PageableParamInput, $memberId: Long!, $year: Int!) {
        getLateContributionsByMember(pageableParam: $pageableParam, memberId: $memberId, year: $year) {
          data {
            id
            member{
              id
              name
            }
            amount
            paymentDate
            month
            penaltyAmount
            year
          }
        }
      }
    `;
    return this.apollo.watchQuery({
      query: GET_LATE_CONTRIBUTIONS_BY_MEMBER,
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

  deleteContribution(contributionId: number) {
    return this.apollo.mutate({
      mutation: gql`
      mutation deleteContribution($contributionId: Long!) {
        deleteContribution(contributionId: $contributionId) {
          status
          message
        }
      }
    `,
      variables: {
        contributionId: contributionId
      }
    });
  }

  saveYearlyDividend(dividendeData: any){
    const SAVE_DIVIDEND = gql`
        mutation saveYearlyDividend($dividendDto: DividendDtoInput!) { 
          saveYearlyDividend(dividendDto: $dividendDto) {
            data {
              id
              withdrawnAmount
            }
          }
        }
      `;
    return this.apollo.mutate({
      mutation: SAVE_DIVIDEND,
      variables: {
        dividendDto: dividendeData
      }
    });
  }

  getYearlyDividendByMember(memberId: number, year: number, page: number = 0, size: number = 500) {
    const GET_DIVIDENDS_BY_MEMBER = gql`
      query getYearlyDividendByMember($pageableParam: PageableParamInput, $memberId: Long!, $year: Int!) {
        getYearlyDividendByMember(pageableParam: $pageableParam, memberId: $memberId, year: $year) {
          data {
            id
            member{
              id
              name
            }
            allocatedAmount
            withdrawnAmount
            remainingBalance
            approved
            year
          }
        }
      }
    `;
    return this.apollo.watchQuery({
      query: GET_DIVIDENDS_BY_MEMBER,
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

  getYearlyDividends(page: number = 0, size: number = 500){
    const GET_DIVIDENDS_BY_MEMBER = gql`
      query getYearlyDividends($pageableParam: PageableParamInput) {
        getYearlyDividends(pageableParam: $pageableParam) {
          data {
            id
            member{
              id
              name
            }
            allocatedAmount
            withdrawnAmount
            remainingBalance
            approved
            year
          }
        }
      }
    `;
    return this.apollo.watchQuery({
      query: GET_DIVIDENDS_BY_MEMBER,
      variables: {
        pageableParam: {
          page,
          size
        },
      },
      fetchPolicy: 'network-only'
    }).valueChanges;
  }

  approveDividend(yearlyDividendId: number) {
  const APPROVE_EXPENDITURE = gql`
    mutation approveDividend($yearlyDividendId: Long!) {
      approveDividend(yearlyDividendId: $yearlyDividendId) {
        status
        message
        data {
          id
          approved
        }
      }
    }
  `;

  return this.apollo.mutate({
    mutation: APPROVE_EXPENDITURE,
    variables: {
      yearlyDividendId: yearlyDividendId
    }
  });
}

  deleteYearlyDividend(yearlyDividendId: number){
  return this.apollo.mutate({
    mutation: gql`
      mutation deleteYearlyDividend($id: Long!) {
        deleteYearlyDividend(id: $id) {
          status
          message
        }
      }
    `,
    variables: {
      id: yearlyDividendId
    }
  });
}

insertEntryFeeContributions(amount: number, year: number, month: string) {
  const INSERT_ENTRY_FEE = gql`
    mutation insertEntryFeeContributions($amount: BigDecimal!, $year: Int!, $month: String!) {
      insertEntryFeeContributions(amount: $amount, year: $year, month: $month) {
        status
        message
        data {
          id
          amount
          year
          month
        }
      }
    }
  `;
  return this.apollo.mutate({
    mutation: INSERT_ENTRY_FEE,
    variables: { amount, year, month }
  });
}

}
