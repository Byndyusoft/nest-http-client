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

import { parseEndpoint } from "../parseEndpoint";

describe("parseEndpoint", () => {
  describe("UsersClient", () => {
    it("createUser", () => {
      expect(
        parseEndpoint("POST /users", {
          name: "user1",
          email: "user1@example.com",
        }),
      ).toMatchInlineSnapshot(`
        {
          "data": {
            "email": "user1@example.com",
            "name": "user1",
          },
          "method": "POST",
          "params": {},
          "url": "/users",
        }
      `);
    });

    it("deleteUser", () => {
      expect(
        parseEndpoint("DELETE /users/{userId}{?userVersion}", {
          userId: "1",
          userVersion: 5,
        }),
      ).toMatchInlineSnapshot(`
        {
          "method": "DELETE",
          "params": {
            "userVersion": 5,
          },
          "url": "/users/1",
        }
      `);
    });

    it("getUserById", () => {
      expect(
        parseEndpoint("GET /users/{userId}", {
          userId: "1",
        }),
      ).toMatchInlineSnapshot(`
        {
          "method": "GET",
          "params": {},
          "url": "/users/1",
        }
      `);
    });

    it("listUsers", () => {
      expect(
        parseEndpoint("GET /users", {
          userIds: ["1", "2"],
          pageSize: 10,
          pageToken: "0",
        }),
      ).toMatchInlineSnapshot(`
        {
          "method": "GET",
          "params": {
            "pageSize": 10,
            "pageToken": "0",
            "userIds": [
              "1",
              "2",
            ],
          },
          "url": "/users",
        }
      `);
    });

    it("updateUser", () => {
      expect(
        parseEndpoint("PATCH /users/{userId}{?userVersion}", {
          userId: "1",
          userVersion: 5,
          name: "user1",
          email: "user1@example.com",
        }),
      ).toMatchInlineSnapshot(`
        {
          "data": {
            "email": "user1@example.com",
            "name": "user1",
          },
          "method": "PATCH",
          "params": {
            "userVersion": 5,
          },
          "url": "/users/1",
        }
      `);
    });
  });
});
