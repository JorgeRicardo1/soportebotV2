import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, finalize, Observable, throwError } from "rxjs";
import { LoaderService } from "../http/loader.service";
import { SkeletonLoaderService } from "../../../pages/chat/services/skeleton-loader.service";

export const LoaderInterceptor : HttpInterceptorFn = (
  request : HttpRequest<any>,
  next : HttpHandlerFn) : Observable<HttpEvent<unknown>> => {

    const router = inject(Router);
    const loaderService = inject(LoaderService);
    const skeletonLoaderService = inject(SkeletonLoaderService);

    const title = document.title;
    if (!request.url.includes(router.url) && !request.url.includes(title)) {

      loaderService.show();
    }

    if(request.url.includes('chat/completion')){
      console.log('chatenando')
      skeletonLoaderService.show();
    }

    return next(request).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => {
        loaderService.hide();
        skeletonLoaderService.hide();
      })
    );
  }


function handleErrorResponse(error : HttpErrorResponse) {

  const errorResponde =  `Error`;
  return throwError(() => 'Errror');
}
