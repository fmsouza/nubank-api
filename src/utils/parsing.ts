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

function findAmount(transaction: GenericTransaction): number {
  let amountSource = "0";
  if (transaction.detail?.includes("R$")) {
    amountSource = transaction.detail.split("R$")[1].trim();
  } else if (transaction.footer?.includes("R$")) {
    amountSource = transaction.footer.split("R$")[1].trim();
  }
  amountSource = amountSource?.replace(".", "").replace(",", ".");

  return parseFloat(amountSource);
}

export function parseGenericTransaction(
  transaction: GenericTransaction
): AccountTransaction {
  return {
    id: transaction.id,
    __typename: transaction.__typename,
    title: transaction.title,
    detail: transaction.detail,
    postDate: transaction.postDate,
    amount: transaction.amount ?? findAmount(transaction),
  };
}
