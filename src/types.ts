import { Http } from "./utils/http";

export interface Adapters {
  uuid: Function;
}

export interface Context {
  adapters: Adapters;
  http: Http;
}
