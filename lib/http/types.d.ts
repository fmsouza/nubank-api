type HttpRequestOptions = {
    method: "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "OPTIONS";
    url: string;
    body?: Record<string, string>;
    params?: Record<string, string>;
};
type HttpResponse = {};
export interface HttpClientDriver {
    request(options: HttpRequestOptions): Promise<HttpResponse>;
}
export {};
