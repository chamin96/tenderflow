import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IAdmin } from 'app/shared/model/admin.model';

type EntityResponseType = HttpResponse<IAdmin>;
type EntityArrayResponseType = HttpResponse<IAdmin[]>;

@Injectable({ providedIn: 'root' })
export class AdminService {
  public resourceUrl = SERVER_API_URL + 'api/admins';

  constructor(protected http: HttpClient) {}

  create(admin: IAdmin): Observable<EntityResponseType> {
    return this.http.post<IAdmin>(this.resourceUrl, admin, { observe: 'response' });
  }

  update(admin: IAdmin): Observable<EntityResponseType> {
    return this.http.put<IAdmin>(this.resourceUrl, admin, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAdmin>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAdmin[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
