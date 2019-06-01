import { IUser } from 'app/core/user/user.model';
import { IReply } from 'app/shared/model/reply.model';

export interface ISupplier {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  user?: IUser;
  replies?: IReply[];
}

export class Supplier implements ISupplier {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public user?: IUser,
    public replies?: IReply[]
  ) {}
}
