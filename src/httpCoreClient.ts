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

/* eslint-disable @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any */

import { Inject, Injectable } from "@nestjs/common";
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import deepMerge from "deepmerge";

import { IHttpClientOptions } from "./httpClientOptionsInterface";
import { HttpClientOptionsToken } from "./httpClientOptionsToken";

@Injectable()
export class HttpCoreClient {
  private readonly axios: AxiosInstance;
  private readonly config: AxiosRequestConfig;

  public constructor(
    @Inject(HttpClientOptionsToken)
    options: IHttpClientOptions,
  ) {
    this.axios = options.axios;
    this.config = options.config ?? {};
  }

  public delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axios.delete(url, this.mergeConfigs(config));
  }

  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axios.get(url, this.mergeConfigs(config));
  }

  public head<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axios.head(url, this.mergeConfigs(config));
  }

  public patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axios.patch(url, data, this.mergeConfigs(config));
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axios.post(url, data, this.mergeConfigs(config));
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axios.put(url, data, this.mergeConfigs(config));
  }

  public request<T = any>(
    config: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axios.request(this.mergeConfigs(config));
  }

  private mergeConfigs(config: AxiosRequestConfig = {}): AxiosRequestConfig {
    return deepMerge(this.config, config);
  }
}
