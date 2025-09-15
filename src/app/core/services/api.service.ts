import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})

export class ApiService {
    private baseUrl = "https://157.180.86.208/api/";

    constructor(private http: HttpClient) {}

    getData() {
        return this.http.get(`${this.baseUrl}/api`);
    }

    postData(payload: any) {
        return this.http.post(`${this.baseUrl}/api`, payload);
    }
}