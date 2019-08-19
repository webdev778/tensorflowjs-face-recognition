import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';

@Injectable()
export class UserService {
    uri = 'http://localhost:4200';
    
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${this.uri}/users`);
    }

    getById(id: number) {
        return this.http.get(`${this.uri}/users/` + id);
    }

    register(user: User) {
        return this.http.post(`${this.uri}/users/register`, user);
    }

    update(user: User) {
        return this.http.put(`${this.uri}/users/` + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(`${this.uri}/users/` + id);
    }
}