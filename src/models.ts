export interface Customer {

}

interface InvestmentBalance {
  id: string;
  netAmount: number;
  yield: any;
  incomeTax: number;
  iofTax: number;
}

export interface Investment {
  id: string;
  rate: number;
  vehicle: any;
  openDate: string;
  maturityDate: string;
  principal: any;
  redeemedBalance: InvestmentBalance;
}

export interface Boleto {
  id: string;
  dueDate: string;
  barcode: string;
  readableBarcode: string;
  amount: number;
}

export interface MoneyRequest {
  id: string;
  amount: number;
  message: string;
  url: string;
}

export interface PixKey {
  id: string;
  kind: string;
  value: any;
  formattedValue: string;
  itemDeepLink: string;
  badge: string;
}

export interface Transaction {
  category: string;
  time: string;
  title: string;
  id: string;
  amount: number;
  description?: string;
  details?: TransactionDetails;
  _links?: InternalLink;
  href?: string;
}

interface TransactionDetails {
  fx?: ForeignTransaction;
  tags?: string[];
  lat?: number;
  lon?: number;
  charges?: TransactionCharges;
  subcategory?: string;
}

interface TransactionCharges {
  count: number;
  amount: number;
}

interface InternalLink {
  self: ResourceHref;
}

interface ResourceHref {
  href: string;
}

interface ForeignTransaction {
  currency_origin: string;
  amount_origin: number;
  amount_usd: number;
  precise_amount_origin: string;
  precise_amount_usd: string;
  exchange_rate: number;
}

export interface Bill {
  id: string;
  state: "overdue" | "open" | "future" | "closed";
  summary: BillSummary;
  _links: BillLinks;
  line_items?: BillLineItem[];
}

interface BillSummary {
  remaining_balance?: number;
  due_date: string;
  close_date: string;
  late_interest_fee?: string;
  past_balance: number;
  late_fee?: string;
  effective_due_date: string;
  total_balance: number;
  interest_rate: string;
  interest: number;
  total_cumulative: number;
  paid: number;
  minimum_payment: number;
  remaining_minimum_payment?: number;
  open_date: string;
}

interface BillLinks {
  self?: ResourceHref;
  barcode?: ResourceHref;
  boleto_email?: ResourceHref;
  invoice_email?: ResourceHref;
}

interface BillLineItem {
  amount: number;
  index?: number;
  title: string;
  post_date: string;
  id: string;
  href?: string;
  category?: string;
  charges?: number;
}

export interface AccountTransaction {
  id: string;
  __typename: string;
  title: string;
  detail: string;
  postDate: string;
  amount?: number;
  destinationAccount?: { name: string };
  originAccount?: { name: string };
}
