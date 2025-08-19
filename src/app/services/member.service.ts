import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private url = 'http://localhost:7080/api/members';

  constructor(private apollo: Apollo, private http: HttpClient) { }

  getMembers(page: number = 0, size: number = 500) {
    const GET_MEMBERS = gql`
  query GetMkobaMembers($pageableParam: PageableParamInput) {
    getMkobaMembers(pageableParam: $pageableParam) {
      data {
        id
        name
        gender
        email
        phone
        joiningDate
        memberShares
        memberRole
      }
    }
  }
`;
    return this.apollo.watchQuery({
      query: GET_MEMBERS,
      variables: {
        pageableParam: {
          page,
          size
        }
      },
      fetchPolicy: 'network-only'
    }).valueChanges;
  }

  getMkobaMemberById(memberId: number) {
    return this.apollo.query({
      query: gql`
        query($memberId: Long!) {
          getMkobaMemberById(memberId: $memberId) {
            data
          }
        }
      `,
      variables: { memberId },
      fetchPolicy: 'no-cache'
    });
  }

  saveMkobaMember(member: any) {
    const SAVE_MEMBER = gql`
    mutation saveMkobaMember($memberDto: MemberDtoInput!) {
      saveMkobaMember(memberDto: $memberDto) {
        data {
          id
          name
          gender
          email
          phone
          joiningDate
          memberRole
        }
        message
        status
      }
    }
  `;
    return this.apollo.mutate({
      mutation: SAVE_MEMBER,
      variables: {
        memberDto: {
          id: member.id ?? null, // important for update
          name: member.name,
          gender: member.gender,
          email: member.email,
          phone: member.phone,
          joiningDate: member.joiningDate,
          memberRole: member.memberRole
        }
      }
    });
  }

  getTotalMemberSharesByYear(memberId: number, year: number) {
    return this.apollo.query({
      query: gql`
        query($memberId: Long!, $year: Int!) {
          getTotalMemberSharesByYear(memberId: $memberId, year: $year) {
            data
          }
        }
      `,
      variables: { memberId, year },
      fetchPolicy: 'no-cache'
    });
  }

  deleteMember(memberId: number): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation DeleteMkobaMember($id: Long!) {
        deleteMkobaMember(id: $id) {
          status
          message
        }
      }
    `,
      variables: {
        id: Number(memberId) // 👈 Hakikisha ni primitive number
      }
    });
  }

  getMemberPhoto(filename: string): Observable<any> {
    const query = gql`
      query getPhoto($filename: String!) {
        getMemberPhoto(filename: $filename) {
          data
        }
      }
    `;
    return this.apollo.query({
      query,
      variables: { filename },
      fetchPolicy: 'no-cache'
    });
  }

  // uploadMemberPhoto(memberId: number, file: File): Observable<any> {
  //   // Since Apollo doesn't support file uploads directly, we use REST endpoint here
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   const uploadUrl = `/api/graphql?query=mutation($memberId: Long!, $file: Upload!) { uploadMemberPhoto(memberId: $memberId, file: $file) { status message } }`;
  //   return this.http.post(uploadUrl, formData); // backend must support MultipartResolver
  // }

  uploadMemberPhoto(memberId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.url}/api/members/${memberId}/upload-photo`, formData);
  }

  removeMember(memberData: any){
    const REMOVE_MEMBER = gql`
        mutation removeMember($removeMemberDto: RemoveMemberDtoInput!) { 
          removeMember(removeMemberDto: $removeMemberDto) {
            data {
              id
              removeReason
            }
          }
        }
      `;
    return this.apollo.mutate({
      mutation: REMOVE_MEMBER,
      variables: {
        removeMemberDto: memberData
      }
    });
  }

  getPastMembers(page: number = 0, size: number = 500) {
    const GET_PAST_MEMBERS = gql`
  query getPastMembers($pageableParam: PageableParamInput) {
    getPastMembers(pageableParam: $pageableParam) {
      data {
        id
        name
        gender
        email
        phone
        joiningDate
        memberRole
        isActive
        removedAt
        removeReason
      }
    }
  }
`;
    return this.apollo.watchQuery({
      query: GET_PAST_MEMBERS,
      variables: {
        pageableParam: {
          page,
          size
        }
      },
      fetchPolicy: 'network-only'
    }).valueChanges;
  }
  
  restoreMember(memberId: number): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation restoreMember($id: Long!) {
        restoreMember(id: $id) {
          status
          message
        }
      }
    `,
      variables: {
        id: Number(memberId) // 👈 Hakikisha ni primitive number
      }
    });
  }
}
