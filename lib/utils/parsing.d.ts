import { AccountTransaction } from "../models";
type GenericTransaction = {
    __typename: string;
    tags: string[];
    showClock: boolean;
    displayDate: string;
    footer: string;
    title: string;
    detailsDeeplink: string;
    id: string;
    strikethrough: boolean;
    kind: string;
    iconKey: string;
    postDate: string;
    detail: string;
    amount?: number;
};
export declare function parseGenericTransaction(transaction: GenericTransaction): AccountTransaction;
export {};
