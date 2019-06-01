import { Moment } from 'moment';
import { ITender } from 'app/shared/model/tender.model';
import { ISupplier } from 'app/shared/model/supplier.model';

export interface IReply {
  id?: number;
  date?: Moment;
  responseInfo?: string;
  tender?: ITender;
  supplier?: ISupplier;
}

export class Reply implements IReply {
  constructor(
    public id?: number,
    public date?: Moment,
    public responseInfo?: string,
    public tender?: ITender,
    public supplier?: ISupplier
  ) {}
}
