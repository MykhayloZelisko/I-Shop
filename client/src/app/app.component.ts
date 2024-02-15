import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client';

const GET_ALL_USERS = gql`
  {
    users {
      id
      first_name
      last_name
      phone
      email
      roles {
        id
        role
      }
    }
  }
`;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public users: unknown;

  public constructor(
    private apollo: Apollo,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    // TODO: this method will be changed
    this.apollo
      .use('withCredentials')
      .query({
        query: GET_ALL_USERS,
      })
      .subscribe((data: ApolloQueryResult<any>) => {
        this.users = data.data.users;
        this.cdr.detectChanges();
      });
  }
}
