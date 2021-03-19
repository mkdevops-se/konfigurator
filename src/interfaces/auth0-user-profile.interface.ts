interface Auth0UserEmail {
  value: string;
}

export interface Auth0UserProfile {
  user_id?: string;
  id?: string;
  provider?: string;
  displayName?: string;
  nickname?: string;
  name?: {
    familyName: string;
    givenName: string;
  };
  emails?: Auth0UserEmail[];
  picture?: string;
  locale?: string;
}
