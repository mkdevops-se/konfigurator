interface OpenShiftMetadata {
  name: string;
  selfLink: string;
  uid: string;
  resourceVersion: string;
}

export interface OpenShiftUserProfileInterface {
  kind: 'User';
  apiVersion: 'users.openshift.io/v1';
  metadata: OpenShiftMetadata;
  fullName: string;
  identities: string[];
  groups: string[];
}
