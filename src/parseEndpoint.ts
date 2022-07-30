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

import { AxiosRequestConfig } from "axios";
import _ from "lodash";

export type TEndpointRequest = Pick<
  AxiosRequestConfig,
  "baseURL" | "headers" | "data"
> &
  Record<string, unknown>;

const parseRoute = (
  template: string,
): { method: string; urlTemplate: string } => {
  const [method, urlTemplate] = template.split(" ");

  return {
    method: method.toUpperCase(),
    urlTemplate,
  };
};

/**
 * Simple @octokit/endpoint implementation for axios
 */
export const parseEndpoint = (
  route: string,
  request: TEndpointRequest = {},
): AxiosRequestConfig => {
  const { method, urlTemplate } = parseRoute(route);

  const query: Record<string, unknown> = {};
  let body: unknown | undefined;

  const parameters = _.omit(request, ["baseURL", "headers"]);
  const usedParameters: string[] = [];

  const url = urlTemplate
    .replace(/{(?<params>[^?].+?)}/g, (_substring: string, key: string) => {
      usedParameters.push(key);
      return encodeURIComponent(parameters[key] as string);
    })
    .replace(
      /{\?(?<query>.+?)}/,
      (_substring: string, queryTemplate: string) => {
        const keys = queryTemplate.split(",");

        for (const key of keys) {
          usedParameters.push(key);
          query[key] = parameters[key];
        }

        return "";
      },
    );

  const restParameters = _.omit(parameters, usedParameters) as Record<
    string,
    unknown
  >;

  if (["GET", "HEAD"].includes(method)) {
    for (const [key, value] of Object.entries(restParameters)) {
      query[key] = value;
    }
  } else {
    if ("data" in restParameters) {
      body = restParameters.data;
    } else if (Object.keys(restParameters).length > 0) {
      body = restParameters;
    }
  }

  return _.omitBy(
    {
      method,
      baseUrl: request.baseURL,
      url,
      params: query,
      headers: request.headers,
      data: body,
    },
    (x) => x === undefined,
  );
};
