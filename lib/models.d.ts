interface ResourceHref {
    href: string;
}
interface InternalLink {
    self: ResourceHref;
}
interface CustomerDevice {
    id: string;
    device_id: string;
    user_agent: string;
    push_token: string;
    _links: InternalLink;
}
interface CustomerDocument {
    id: string;
    type: string;
    number: string;
    issuer: string;
    uf: string;
}
export interface Customer {
    id: string;
    cpf: string;
    name: string;
    printed_name: string;
    preferred_name: string;
    email: string;
    phone: string;
    nationality: string;
    marital_status: string;
    dob: string;
    profession: string;
    gender: string;
    address_line1: string;
    address_line2: string;
    address_state: string;
    address_number: string;
    address_postcode: string;
    address_city: string;
    address_country: string;
    address_locality: string;
    address_updated_at: string;
    billing_address_line1: string;
    billing_address_line2: string;
    billing_address_state: string;
    billing_address_city: string;
    billing_address_locality: string;
    billing_address_postcode: string;
    billing_address_country: string;
    billing_address_number: string;
    documents: CustomerDocument[];
    primary_device: CustomerDevice;
    devices: CustomerDevice[];
    channels: string[];
    external_ids: Record<string, string>;
    last_atualizacao_cadastral_at: string;
    reported_income: string;
    mothers_name: string;
    invitations: number;
    _links: Record<string, ResourceHref>;
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
export interface PixPaymentRequest {
    id: string;
    amount: number;
    message: string;
    url: string;
    transactionId: string;
    pixAlias: string;
    brcode: string;
}
export interface CardTransaction {
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
    destinationAccount?: {
        name: string;
    };
    originAccount?: {
        name: string;
    };
}
export {};
