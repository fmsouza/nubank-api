import { AuthType } from "../context";
export declare function RequiresAuth(...selectedAuthTypes: AuthType[]): (this: any, ...args: any[]) => any;
