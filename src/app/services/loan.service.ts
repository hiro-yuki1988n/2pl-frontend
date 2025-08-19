import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  constructor(private apollo: Apollo) { }

  saveLoan(loanData: any) {
    const SAVE_LOAN = gql`
      mutation SaveLoan($saveLoanDto: SaveLoanDtoInput!) {
        saveLoan(saveLoanDto: $saveLoanDto) {
          data {
            id
            amount
            interestRate 
            startDate
            dueDate
            isPaid
            isPenaltyApplied
          }
        }
      }
    `;

    return this.apollo.mutate({
      mutation: SAVE_LOAN,
      variables: {
        saveLoanDto: loanData
      }
    });
  }

  saveLoanPayment(paidLoanData: any) {
    const SAVE_LOAN_PAYMENT = gql`
      mutation saveLoanPayment($loanPaymentDto: LoanPaymentDtoInput!) {
        saveLoanPayment(loanPaymentDto: $loanPaymentDto) {
          data {
            id
            amount
            payDate
            description
          }
        }
      }
    `;
    return this.apollo.mutate({
      mutation: SAVE_LOAN_PAYMENT,
      variables: {
        loanPaymentDto: paidLoanData
      }
    });
  }

  getTotalLoansByMember(memberId: number, year: number) {
    return this.apollo.query({
      query: gql`
        query($memberId: Long!, $year: Int!) {
          getTotalLoansByMember(memberId: $memberId, year: $year) {
            data
          }
        }
      `,
      variables: { memberId, year },
      fetchPolicy: 'no-cache'
    });
  }

  getTotalPenaltiesByMember(memberId: number, year: number) {
    return this.apollo.query({
      query: gql`
        query($memberId: Long!, $year: Int!) {
          getTotalPenaltiesByMember(memberId: $memberId, year: $year) {
            data
          }
        }
      `,
      variables: { memberId, year },
      fetchPolicy: 'no-cache'
    });
  }

  getLoanByMember(memberId: number, year: number, page: number = 0, size: number = 500) {
    const GET_LOANS_BY_MEMBER = gql`
      query getLoanByMember($pageableParam: PageableParamInput, $memberId: Long!, $year: Int!) {
        getLoanByMember(pageableParam: $pageableParam, memberId: $memberId, year: $year) {
          data {
            id
            member{
              id
              name
            }
            amount
            interestRate
            interestAmount
            startDate
            dueDate
            isPaid
            penaltyAmount
            payableAmount
          }
        }
      }
    `;
    return this.apollo.watchQuery({
      query: GET_LOANS_BY_MEMBER,
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

  getLoanPaymentsByMember(memberId: number, year: number, page: number = 0, size: number = 500) {
    const GET_LOANS_BY_MEMBER = gql`
      query getLoanPaymentsByMember($pageableParam: PageableParamInput, $memberId: Long!, $year: Int!) {
        getLoanPaymentsByMember(pageableParam: $pageableParam, memberId: $memberId, year: $year) {
          data {
            id
            loan{
              amount
              member{
                id
                name
              }
            }
            amount
            payDate
            description
          }
        }
      }
    `;
    return this.apollo.watchQuery({
      query: GET_LOANS_BY_MEMBER,
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

  getLatePaidLoansByMember(memberId: number, year: number, page: number = 0, size: number = 500) {
    const GET_LATE_LOANS_BY_MEMBER = gql`
      query getLatePaidLoansByMember($pageableParam: PageableParamInput, $memberId: Long!, $year: Int!) {
        getLatePaidLoansByMember(pageableParam: $pageableParam, memberId: $memberId, year: $year) {
          data {
            id
            member{
              id
              name
            }
            amount
            interestRate
            interestAmount
            startDate
            dueDate
            isPaid
            penaltyAmount
            payableAmount
          }
        }
      }
    `;
    return this.apollo.watchQuery({
      query: GET_LATE_LOANS_BY_MEMBER,
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

  getMembersLoans(page: number = 0, size: number = 500) {
    const GET_LOANS = gql`
      query getMembersLoans($pageableParam: PageableParamInput) {
        getMembersLoans(pageableParam: $pageableParam) {
          data {
            id
            member{
              id
              name
            }
            amount
            interestRate
            interestAmount
            startDate
            dueDate
            isPaid
            penaltyAmount
            payableAmount
            unpaidAmount
          }
        }
      }
    `;
    return this.apollo.watchQuery({
      query: GET_LOANS,
      variables: {
        pageableParam: {
          page,
          size
        }
      },
      fetchPolicy: 'network-only'
    }).valueChanges;
  }

  getLoanPayments(page: number = 0, size: number = 500) {
    const GET_LOANS_PAYMENTS = gql`
      query getLoanPayments($pageableParam: PageableParamInput, $year: Int!) {
          getLoanPayments(pageableParam: $pageableParam, year: $year) {
            data {
              id
              loan {
                id
                amount
                payableAmount
                member {
                  id
                  name
                }
              }
              amount
              payDate
              description
            }
          }
        }
      `;
    const currentYear = new Date().getFullYear();

    return this.apollo.watchQuery({
      query: GET_LOANS_PAYMENTS,
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

  deleteMemberLoan(loanId: number) { 
    return this.apollo.mutate({
      mutation: gql`
      mutation deleteMemberLoan($id: Long!) {
        deleteMemberLoan(id: $id) {
          status
          message
        }
      }
    `,
      variables: {
        id: loanId
      }
    });
  }

  deleteLoanPayment(loanPaymentId: number) {
    return this.apollo.mutate({
      mutation: gql`
      mutation deleteLoanPayment($id: Long!) {
        deleteLoanPayment(id: $id) {
          status
          message
        }
      }
    `,
      variables: {
        id: loanPaymentId
      }
    });
  }
}

