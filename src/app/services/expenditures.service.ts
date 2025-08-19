import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class ExpendituresService {

  constructor(private apollo: Apollo) { }

  saveExpenditure(expenditureData: any) {
    const SAVE_EXPENDITURE = gql`
          mutation saveExpenditure($expendituresDto: ExpendituresDtoInput!) { 
            saveExpenditure(expendituresDto: $expendituresDto) {
              data {
                id
                amount
                dateIssued
                expenseType
                description
              }
            }
          }
        `;
    return this.apollo.mutate({
      mutation: SAVE_EXPENDITURE,
      variables: {
        expendituresDto: expenditureData
      }
    });
  }

  getExpenditures(page: number = 0, size: number = 500) {
    const GET_EXPENDITURES = gql`
    query getExpenditures($pageableParam: PageableParamInput, $year: Int!) {
      getExpenditures(pageableParam: $pageableParam, year: $year) {
        data {
          id
          amount
          dateIssued
          expenseType
          description
          approved
        }
      }
    }
  `;

    const currentYear = new Date().getFullYear();

    return this.apollo.watchQuery({
      query: GET_EXPENDITURES,
      variables: {
        pageableParam: {
          page,
          size
        },
        year: currentYear
      },
      fetchPolicy: 'network-only'
    }).valueChanges;
  }

  getTotalExpenditures(memberId: number, year: number) {
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

  deleteExpense(expenditureId: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation deleteExpenditure($expenditureId: Long!) {
          deleteExpenditure(expenditureId: $expenditureId) {
            status
            message
          }
        }
      `,
      variables: {
        expenditureId: expenditureId
      }
    });
  }

  approveExpenditure(expenditureId: number) {
  const APPROVE_EXPENDITURE = gql`
    mutation approveExpenditure($expenditureId: Long!) {
      approveExpenditure(expenditureId: $expenditureId) {
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
      expenditureId: expenditureId
    }
  });
}

}
