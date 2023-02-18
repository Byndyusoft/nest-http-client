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

import { AxiosInstance, AxiosRequestConfig } from "axios";
import { mock, MockProxy } from "jest-mock-extended";

import { HttpCoreClient } from "../httpCoreClient";

interface BaseTestCase {
  readonly name: string;
  readonly url: string;
  readonly expectedConfig: AxiosRequestConfig;
}

interface TestCaseWithInitialConfig extends BaseTestCase {
  readonly initialConfig: AxiosRequestConfig;
}

interface TestCaseWithoutInitialConfig extends BaseTestCase {
  readonly config: AxiosRequestConfig;
}

type TestCaseWithConfigsMerge = TestCaseWithInitialConfig &
  TestCaseWithoutInitialConfig;

type TestCaseWithoutBody = BaseTestCase &
  Partial<Omit<TestCaseWithConfigsMerge, keyof BaseTestCase>>;

interface TestCaseWithBody extends TestCaseWithoutBody {
  readonly body?: unknown;
}

describe("HttpCoreClient", () => {
  let axios: MockProxy<AxiosInstance>;

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

  const testCasesWithInitialConfig: TestCaseWithInitialConfig[] = [
    {
      name: "with initial baseURL",
      url: "/some-path",
      initialConfig: {
        baseURL: "https://example.com",
      },
      expectedConfig: {
        baseURL: "https://example.com",
      },
    },
    {
      name: "with initial headers",
      url: "/some-path",
      initialConfig: {
        baseURL: "https://example.com",
        headers: {
          "x-api-key": "api-key",
        },
      },
      expectedConfig: {
        baseURL: "https://example.com",
        headers: {
          "x-api-key": "api-key",
        },
      },
    },
  ];

  const testCasesWithoutInitialConfig: TestCaseWithoutInitialConfig[] = [
    {
      name: "without initial baseURL",
      url: "/some-path",
      config: {
        baseURL: "https://example.com",
      },
      expectedConfig: {
        baseURL: "https://example.com",
      },
    },
  ];

  const testCasesWithConfigsMerge: TestCaseWithConfigsMerge[] = [
    {
      name: "with query",
      url: "/some-path",
      initialConfig: {
        baseURL: "https://example.com",
      },
      config: {
        params: {
          q: "search",
        },
      },
      expectedConfig: {
        baseURL: "https://example.com",
        params: {
          q: "search",
        },
      },
    },
    {
      name: "with custom headers",
      url: "/some-path",
      initialConfig: {
        baseURL: "https://example.com",
      },
      config: {
        headers: {
          userId: "1",
        },
      },
      expectedConfig: {
        baseURL: "https://example.com",
        headers: {
          userId: "1",
        },
      },
    },
    {
      name: "with initial and custom headers",
      url: "/some-path",
      initialConfig: {
        baseURL: "https://example.com",
        headers: {
          "x-api-key": "api-key",
        },
      },
      config: {
        headers: {
          userId: "1",
        },
      },
      expectedConfig: {
        baseURL: "https://example.com",
        headers: {
          "x-api-key": "api-key",
          userId: "1",
        },
      },
    },
  ];

  const testCasesWithoutBody: TestCaseWithoutBody[] = [
    ...testCasesWithInitialConfig,
    ...testCasesWithoutInitialConfig,
    ...testCasesWithConfigsMerge,
  ];

  const testCasesWithBody: TestCaseWithBody[] = testCasesWithoutBody.flatMap(
    (testCase) => [
      {
        ...testCase,
        name: `${testCase.name} [without body]`,
        body: undefined,
      },
      {
        ...testCase,
        name: `${testCase.name} [with body]`,
        body: {
          payload: 1,
        },
      },
    ],
  );

  beforeAll(() => {
    axios = mock();
  });

  describe.each(httpMethodsWithoutBody)("must perform %s request", (method) => {
    it.each(testCasesWithoutBody)(
      "$name",
      async ({ url, initialConfig, config, expectedConfig }) => {
        const httpCoreClient = new HttpCoreClient({
          axios,
          config: initialConfig,
        });

        await httpCoreClient[method](url, config);

        expect(axios[method]).toBeCalledWith(url, expectedConfig);
      },
    );
  });

  describe.each(httpMethodsWithBody)("must perform %s request", (method) => {
    it.each(testCasesWithBody)(
      "$name",
      async ({ url, initialConfig, body, config, expectedConfig }) => {
        const httpCoreClient = new HttpCoreClient({
          axios,
          config: initialConfig,
        });

        await httpCoreClient[method](url, body, config);

        expect(axios[method]).toBeCalledWith(url, body, expectedConfig);
      },
    );
  });

  describe("must perform request", () => {
    describe.each(httpMethodsWithoutBody)("for %s method", (method) => {
      it.each(testCasesWithoutBody)(
        "$name",
        async ({ url, initialConfig, config, expectedConfig }) => {
          const httpCoreClient = new HttpCoreClient({
            axios,
            config: initialConfig,
          });

          await httpCoreClient.request({
            url,
            method,
            ...config,
          });

          expect(axios.request).toBeCalledWith({
            url,
            method,
            ...expectedConfig,
          });
        },
      );
    });

    describe.each(httpMethodsWithBody)("for %s method", (method) => {
      it.each(testCasesWithBody)(
        "$name",
        async ({ url, initialConfig, body, config, expectedConfig }) => {
          const httpCoreClient = new HttpCoreClient({
            axios,
            config: initialConfig,
          });

          await httpCoreClient.request({
            url,
            method,
            data: body,
            ...config,
          });

          expect(axios.request).toBeCalledWith({
            url,
            method,
            data: body,
            ...expectedConfig,
          });
        },
      );
    });
  });

  describe("must perform endpoint request", () => {
    describe.each(httpMethodsWithoutBody)("for %s method", (method) => {
      it.each(testCasesWithoutBody)(
        "$name",
        async ({ url, initialConfig, config, expectedConfig }) => {
          const httpCoreClient = new HttpCoreClient({
            axios,
            config: initialConfig,
          });

          await httpCoreClient.endpoint(
            `${method} ${url}${
              config?.params
                ? `{?${Object.keys(config.params as object).join(",")}}`
                : ""
            }`,
            {
              baseURL: config?.baseURL,
              headers: config?.headers,
              ...config?.params,
            },
          );

          expect(axios.request).toBeCalledWith({
            url,
            method: method.toUpperCase(),
            params: {},
            ...expectedConfig,
          });
        },
      );
    });

    describe.each(httpMethodsWithBody)("for %s method", (method) => {
      it.each(testCasesWithBody)(
        "$name",
        async ({ url, initialConfig, body, config, expectedConfig }) => {
          const httpCoreClient = new HttpCoreClient({
            axios,
            config: initialConfig,
          });

          await httpCoreClient.endpoint(
            `${method} ${url}${
              config?.params
                ? `{?${Object.keys(config.params as object).join(",")}}`
                : ""
            }`,
            {
              baseURL: config?.baseURL,
              headers: config?.headers,
              ...config?.params,
              ...(body ? body : {}),
            },
          );

          expect(axios.request).toBeCalledWith({
            url,
            method: method.toUpperCase(),
            params: {},
            data: body,
            ...expectedConfig,
          });
        },
      );
    });
  });
});
