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

import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";

import { HttpCoreClient } from "./httpCoreClient";

@Injectable()
export class HttpClient {
  public constructor(private readonly httpCoreClient: HttpCoreClient) {}

  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.httpCoreClient.delete<T>(url, config);

    return response.data;
  }

  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.httpCoreClient.get<T>(url, config);

    return response.data;
  }

  public async head<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.httpCoreClient.head<T>(url, config);

    return response.data;
  }

  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.httpCoreClient.patch<T>(url, data, config);

    return response.data;
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.httpCoreClient.post<T>(url, data, config);

    return response.data;
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.httpCoreClient.put<T>(url, data, config);

    return response.data;
  }

  public async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.httpCoreClient.request<T>(config);

    return response.data;
  }
}
