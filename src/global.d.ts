declare interface ICredentialProfile {
  [key: string]: {
    aws_access_key_id: string;
    aws_secret_access_key: string;
    aws_session_token: string;
  };
}

declare interface IProperties {
  defaultProfile?: string;
  masterProfile?: string;
}
