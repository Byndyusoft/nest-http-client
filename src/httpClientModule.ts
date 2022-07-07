/*
 * Copyright 2022 Byndyusoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  DynamicModuleHelper,
  TRegisterAsyncOptions,
} from "@byndyusoft/nest-dynamic-module";
import { DynamicModule, Module } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";

import { HttpClient } from "./httpClient";
import { HttpClientBaseOptionsToken } from "./httpClientBaseOptionsToken";
import { IHttpClientOptions } from "./httpClientOptionsInterface";
import { HttpClientOptionsToken } from "./httpClientOptionsToken";
import { HttpCoreClient } from "./httpCoreClient";

const providers = [HttpCoreClient, HttpClient];

@Module({
  providers,
  exports: providers,
})
export class HttpClientModule {
  public static registerAsync(
    options?: TRegisterAsyncOptions<IHttpClientOptions>,
  ): DynamicModule {
    return DynamicModuleHelper.registerAsync(
      {
        module: HttpClientModule,
      },
      HttpClientOptionsToken,
      options,
    );
  }

  public static registerClientModule(
    dynamicModule: DynamicModule,
    options?: TRegisterAsyncOptions<IHttpClientOptions>,
    configFactory?: (config?: AxiosRequestConfig) => AxiosRequestConfig,
  ): DynamicModule {
    return DynamicModuleHelper.registerAsync(
      {
        ...dynamicModule,
        providers: [
          ...providers,
          ...(dynamicModule.providers ?? []),
          {
            provide: HttpClientOptionsToken,
            inject: [HttpClientBaseOptionsToken],
            useFactory: (
              baseOptions: IHttpClientOptions,
            ): IHttpClientOptions => ({
              ...baseOptions,
              config: configFactory?.(baseOptions.config) ?? baseOptions.config,
            }),
          },
        ],
      },
      HttpClientBaseOptionsToken,
      options,
    );
  }
}
