export interface CreateClient {
  name: string;
  scopes: string[];
  redirectUrls: string[];
}

export interface UpdateClient {
  id: string;
  scopes: string[];
  redirectUrls: string[];
}

type stringDict = { [key: string]: string };

export interface GetClient extends stringDict{
  id: string;
}