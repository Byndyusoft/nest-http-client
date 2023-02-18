/*
 * Copyright 2023 Byndyusoft
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

import { AxiosResponse } from "axios";
import { mock, MockProxy } from "jest-mock-extended";

import { HttpClient } from "../httpClient";
import { HttpCoreClient } from "../httpCoreClient";

describe("HttpClient", () => {
  let httpClient: HttpClient;

  let httpCoreClient: MockProxy<HttpCoreClient>;

  const httpMethodsWithoutBody = [
    "delete" as const,
    "get" as const,
    "head" as const,
  ];

  const httpMethodsWithBody = [
    "patch" as const,
    "post" as const,
    "put" as const,
  ];

  const responseData = {
    answer: 42,
  };

  const response = {
    data: responseData,
  } as unknown as AxiosResponse;

  beforeAll(() => {
    httpCoreClient = mock();

    httpClient = new HttpClient(httpCoreClient);
  });

  it.each(httpMethodsWithoutBody)("must perform %s request", async (method) => {
    httpCoreClient[method].mockResolvedValue(response);

    await expect(
      httpClient[method]("/some-path", {
        params: {
          q: "search",
        },
      }),
    ).resolves.toStrictEqual(responseData);

    expect(httpCoreClient[method]).toHaveBeenCalledWith("/some-path", {
      params: {
        q: "search",
      },
    });
  });

  it.each(httpMethodsWithBody)("must perform %s request", async (method) => {
    httpCoreClient[method].mockResolvedValue(response);

    await expect(
      httpClient[method](
        "/some-path",
        {
          payload: 1,
        },
        {
          params: {
            q: "search",
          },
        },
      ),
    ).resolves.toStrictEqual(responseData);

    expect(httpCoreClient[method]).toHaveBeenCalledWith(
      "/some-path",
      {
        payload: 1,
      },
      {
        params: {
          q: "search",
        },
      },
    );
  });

  it("must perform request", async () => {
    httpCoreClient.request.mockResolvedValue(response);

    await expect(
      httpClient.request({
        url: "/some-path",
        params: {
          q: "search",
        },
      }),
    ).resolves.toStrictEqual(responseData);

    expect(httpCoreClient.request).toHaveBeenCalledWith({
      url: "/some-path",
      params: {
        q: "search",
      },
    });
  });

  it("must perform endpoint request", async () => {
    httpCoreClient.endpoint.mockResolvedValue(response);

    await expect(
      httpClient.endpoint("GET /some-path", {
        q: "search",
      }),
    ).resolves.toStrictEqual(responseData);

    expect(httpCoreClient.endpoint).toHaveBeenCalledWith("GET /some-path", {
      q: "search",
    });
  });
});
