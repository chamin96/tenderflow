import { IUser } from 'app/core/user/user.model';
import { ITender } from 'app/shared/model/tender.model';

export interface IAdmin {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  user?: IUser;
  tenders?: ITender[];
}

export class Admin implements IAdmin {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public user?: IUser,
    public tenders?: ITender[]
  ) {}
}
