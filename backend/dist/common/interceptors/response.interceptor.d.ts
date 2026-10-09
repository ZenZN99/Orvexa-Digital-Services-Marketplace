import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class ResponseInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
