import { Transaction } from 'sequelize';

export interface UseCase<IRequest, IResponse> {
  execute(
    request: IRequest,
    transaction?: Transaction,
  ): IResponse | Promise<IResponse> | PromiseLike<IResponse>;
}
