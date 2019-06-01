import { IAdmin } from 'app/shared/model/admin.model';

export interface ITender {
  id?: number;
  title?: string;
  description?: string;
  infoContentType?: string;
  info?: any;
  admin?: IAdmin;
}

export class Tender implements ITender {
  constructor(
    public id?: number,
    public title?: string,
    public description?: string,
    public infoContentType?: string,
    public info?: any,
    public admin?: IAdmin
  ) {}
}
