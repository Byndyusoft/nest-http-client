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

import { AxiosInstance } from "axios";
import { mock, MockProxy } from "jest-mock-extended";

import { HttpCoreClient } from "../httpCoreClient";

describe("httpCoreClient", () => {
  let axios: MockProxy<AxiosInstance>;

  let httpCoreClient: HttpCoreClient;

  beforeAll(() => {
    axios = mock();

    httpCoreClient = new HttpCoreClient({
      axios,
      config: {
        baseURL: "localhost",
      },
    });
  });
  describe("delete response", () => {
    it("if parameters is empty", async () => {
      await httpCoreClient.delete("some-get-endpoint", {});

      expect(axios.delete).toBeCalledWith("some-get-endpoint", {
        baseURL: "localhost",
      });
    });

    it("if baseURL redeclared", async () => {
      await httpCoreClient.delete("some-get-endpoint", {
        baseURL: "127.0.0.1",
      });

      expect(axios.delete).toBeCalledWith("some-get-endpoint", {
        baseURL: "127.0.0.1",
      });
    });

    it("if parameters is not empty", async () => {
      await httpCoreClient.delete("some-get-endpoint", {
        data: { name: "user1" },
        maxRedirects: 1,
      });

      expect(axios.delete).toBeCalledWith("some-get-endpoint", {
        baseURL: "localhost",
        data: { name: "user1" },
        maxRedirects: 1,
      });
    });
  });

  describe("endpoint response", () => {
    it("if parameters is empty", async () => {
      await httpCoreClient.endpoint("GET /some-get-endpoint", {});

      expect(axios.request).toBeCalledWith({
        baseURL: "localhost",
        method: "GET",
        params: {},
        url: "/some-get-endpoint",
      });
    });

    it("if parameters is not empty", async () => {
      await httpCoreClient.endpoint("POST /some-get-endpoint/{name}", {
        name: "user1",
      });

      expect(axios.request).toBeCalledWith({
        baseURL: "localhost",
        method: "POST",
        params: {},
        url: "/some-get-endpoint/user1",
      });
    });
  });

  describe("get response", () => {
    it("if parameters is empty", async () => {
      await httpCoreClient.get("some-get-endpoint", {});

      expect(axios.get).toBeCalledWith("some-get-endpoint", {
        baseURL: "localhost",
      });
    });

    it("if baseURL redeclared", async () => {
      await httpCoreClient.get("some-get-endpoint", { baseURL: "127.0.0.1" });

      expect(axios.get).toBeCalledWith("some-get-endpoint", {
        baseURL: "127.0.0.1",
      });
    });

    it("if parameters is not empty", async () => {
      await httpCoreClient.get("some-get-endpoint", {
        data: { name: "user1" },
        maxRedirects: 1,
      });

      expect(axios.get).toBeCalledWith("some-get-endpoint", {
        baseURL: "localhost",
        data: { name: "user1" },
        maxRedirects: 1,
      });
    });
  });

  describe("head response", () => {
    it("if parameters is empty", async () => {
      await httpCoreClient.head("some-get-endpoint", {});

      expect(axios.head).toBeCalledWith("some-get-endpoint", {
        baseURL: "localhost",
      });
    });

    it("if baseURL redeclared", async () => {
      await httpCoreClient.head("some-get-endpoint", {
        baseURL: "127.0.0.1",
      });

      expect(axios.head).toBeCalledWith("some-get-endpoint", {
        baseURL: "127.0.0.1",
      });
    });
    it("if parameters is not empty", async () => {
      await httpCoreClient.head("some-get-endpoint", {
        data: { name: "user1" },
        maxRedirects: 1,
      });

      expect(axios.head).toBeCalledWith("some-get-endpoint", {
        baseURL: "localhost",
        data: { name: "user1" },
        maxRedirects: 1,
      });
    });
  });

  describe("patch response", () => {
    it("if parameters is empty", async () => {
      await httpCoreClient.patch("some-post-endpoint", {}, {});

      expect(axios.patch).toBeCalledWith(
        "some-post-endpoint",
        {},
        {
          baseURL: "localhost",
        },
      );
    });

    it("if baseURL redeclared", async () => {
      await httpCoreClient.patch(
        "some-post-endpoint",
        {},
        { baseURL: "127.0.0.1" },
      );

      expect(axios.patch).toBeCalledWith(
        "some-post-endpoint",
        {},
        {
          baseURL: "127.0.0.1",
        },
      );
    });

    it("if parameters is not empty", async () => {
      await httpCoreClient.patch(
        "some-post-endpoint",
        { name: "user1" },
        {
          maxRedirects: 1,
          data: {
            name: "user2",
          },
        },
      );

      expect(axios.patch).toBeCalledWith(
        "some-post-endpoint",
        { name: "user1" },
        {
          maxRedirects: 1,
          baseURL: "localhost",
          data: {
            name: "user2",
          },
        },
      );
    });
  });

  describe("post response", () => {
    it("if parameters is empty", async () => {
      await httpCoreClient.post("some-post-endpoint", {}, {});

      expect(axios.post).toBeCalledWith(
        "some-post-endpoint",
        {},
        {
          baseURL: "localhost",
        },
      );
    });

    it("if baseURL redeclared", async () => {
      await httpCoreClient.post(
        "some-post-endpoint",
        {},
        { baseURL: "127.0.0.1" },
      );

      expect(axios.post).toBeCalledWith(
        "some-post-endpoint",
        {},
        {
          baseURL: "127.0.0.1",
        },
      );
    });

    it("if parameters is not empty", async () => {
      await httpCoreClient.post(
        "some-post-endpoint",
        { name: "user1" },
        {
          maxRedirects: 1,
          data: {
            name: "user2",
          },
        },
      );

      expect(axios.post).toBeCalledWith(
        "some-post-endpoint",
        { name: "user1" },
        {
          maxRedirects: 1,
          baseURL: "localhost",
          data: {
            name: "user2",
          },
        },
      );
    });
  });

  describe("put response", () => {
    it("if parameters is empty", async () => {
      await httpCoreClient.put("some-post-endpoint", {}, {});

      expect(axios.put).toBeCalledWith(
        "some-post-endpoint",
        {},
        {
          baseURL: "localhost",
        },
      );
    });

    it("if baseURL redeclared", async () => {
      await httpCoreClient.put(
        "some-post-endpoint",
        {},
        { baseURL: "127.0.0.1" },
      );

      expect(axios.put).toBeCalledWith(
        "some-post-endpoint",
        {},
        {
          baseURL: "127.0.0.1",
        },
      );
    });

    it("if parameters is not empty", async () => {
      await httpCoreClient.put(
        "some-post-endpoint",
        { name: "user1" },
        {
          maxRedirects: 1,
          data: {
            name: "user2",
          },
        },
      );

      expect(axios.put).toBeCalledWith(
        "some-post-endpoint",
        { name: "user1" },
        {
          maxRedirects: 1,
          baseURL: "localhost",
          data: {
            name: "user2",
          },
        },
      );
    });
  });

  describe("request", () => {
    it("if parameters is empty", async () => {
      await httpCoreClient.request({});

      expect(axios.request).toBeCalledWith({
        baseURL: "localhost",
      });
    });

    it("if baseURL redeclared", async () => {
      await httpCoreClient.request({
        baseURL: "127.0.0.1",
      });

      expect(axios.request).toBeCalledWith({
        baseURL: "127.0.0.1",
      });
    });

    it("if parameters is not empty", async () => {
      await httpCoreClient.request({
        data: { name: "user1" },
        maxRedirects: 1,
      });

      expect(axios.request).toBeCalledWith({
        baseURL: "localhost",
        data: { name: "user1" },
        maxRedirects: 1,
      });
    });
  });
});
