import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

interface Error {
  message?: string;
  status?: number | HttpStatus;
}

export class CustomRpcException extends RpcException {
  constructor(e: Error | RpcException) {
    if (e instanceof RpcException) {
      const rpcError = e.getError() as Error;
      super({
        status: rpcError?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: rpcError?.message || 'Internal Server Error',
      });
    } else {
      super({
        status: e?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: e?.message || 'Internal Server Error',
      });
    }
  }
}
