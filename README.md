# nest-http-client

[![npm@latest](https://img.shields.io/npm/v/@byndyusoft/nest-http-client/latest.svg)](https://www.npmjs.com/package/@byndyusoft/nest-http-client)
[![test](https://github.com/Byndyusoft/nest-http-client/actions/workflows/test.yaml/badge.svg?branch=master)](https://github.com/Byndyusoft/nest-http-client/actions/workflows/test.yaml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

axios for NestJS

## Comparison with `@nestjs/axios`

- [Promises instead of Observables](https://github.com/nestjs/axios/issues/271)
- `axios` dependency [is not pinning](https://github.com/nestjs/axios/pull/149#issuecomment-925764515), you must provide it by yourself (e.g. get it from `HttpService`)
- Allowing you use global `axios` with interceptors and different configs for various clients
- `endpoint` requests like `@octokit/endpoint`

## Requirements

- Node.js v14 LTS or later
- Yarn

## Install

```bash
yarn add @byndyusoft/nest-http-client @nestjs/common axios
```

## Usage

<details>
<summary>1. Create module</summary>

```typescript
import { TRegisterAsyncOptions } from "@byndyusoft/nest-dynamic-module";
import {
  HttpClientModule,
  IHttpClientOptions,
} from "@byndyusoft/nest-http-client";
import { DynamicModule, Global, Module } from "@nestjs/common";
import urlJoin from "proper-url-join";
import qs from "qs";

import { UsersClient } from "./usersClient";

@Global()
@Module({
  providers: [UsersClient],
  exports: [UsersClient],
})
export class ClientModule {
  public static registerAsync(
    options?: TRegisterAsyncOptions<IHttpClientOptions>,
  ): DynamicModule {
    return HttpClientModule.registerClientModule(
      { module: ClientModule },
      options,
      (config) => ({
        ...config,
        baseURL: urlJoin(config?.baseURL as string, "/api/v1"),
        paramsSerializer: (params) =>
          qs.stringify(params, {
            skipNulls: true,
            arrayFormat: "repeat",
          }),
      }),
    );
  }
}
```

</details>

<details>
<summary>2. Create client (using new endpoint method)</summary>

```typescript
import { HttpClient } from "@byndyusoft/nest-http-client";
import { Injectable } from "@nestjs/common";

import {
  CreateUserDto,
  ListUsersQueryDto,
  ListUsersResponseDto,
  ParamsWithUserIdDto,
  QueryWithUserVersionDto,
  UpdateUserDto,
  UserDto,
} from "ᐸDtosᐳ";

@Injectable()
export class UsersClient {
  public constructor(private readonly httpClient: HttpClient) {}

  public createUser(request: CreateUserDto): Promise<UserDto> {
    return this.httpClient.endpoint("POST /users", request);
  }

  public deleteUser(
    request: ParamsWithUserIdDto & QueryWithUserVersionDto,
  ): Promise<UserDto> {
    return this.httpClient.endpoint(
      "DELETE /users/{userId}{?userVersion}",
      request,
    );
  }

  public getUserById(request: ParamsWithUserIdDto): Promise<UserDto> {
    return this.httpClient.endpoint("GET /users/{userId}", request);
  }

  public listUsers(
    request?: Partial<ListUsersQueryDto>,
  ): Promise<ListUsersResponseDto> {
    return this.httpClient.endpoint("GET /users", request);
  }

  public updateUser(
    request: ParamsWithUserIdDto & QueryWithUserVersionDto & UpdateUserDto,
  ): Promise<UserDto> {
    return this.httpClient.endpoint(
      "PATCH /users/{userId}{?userVersion}",
      request,
    );
  }
}
```

</details>

<details>
<summary>2.1. Create client (using standard methods)</summary>

```typescript
import { HttpClient } from "@byndyusoft/nest-http-client";
import { Injectable } from "@nestjs/common";
import _ from "lodash";

import {
  CreateUserDto,
  ListUsersQueryDto,
  ListUsersResponseDto,
  ParamsWithUserIdDto,
  QueryWithUserVersionDto,
  UpdateUserDto,
  UserDto,
} from "ᐸDtosᐳ";

@Injectable()
export class UsersClient {
  public constructor(private readonly httpClient: HttpClient) {}

  public createUser(request: CreateUserDto): Promise<UserDto> {
    return this.httpClient.post("/users", request);
  }

  public deleteUser(
    request: ParamsWithUserIdDto & QueryWithUserVersionDto,
  ): Promise<UserDto> {
    return this.httpClient.delete(
      `/users/${encodeURIComponent(request.userId)}`,
      {
        params: _.omit(request, "userId"),
      },
    );
  }

  public getUserById(request: ParamsWithUserIdDto): Promise<UserDto> {
    return this.httpClient.get(`/users/${encodeURIComponent(request.userId)}`);
  }

  public listUsers(
    request?: Partial<ListUsersQueryDto>,
  ): Promise<ListUsersResponseDto> {
    return this.httpClient.get("/users", {
      params: request,
    });
  }

  public updateUser(
    request: ParamsWithUserIdDto & QueryWithUserVersionDto & UpdateUserDto,
  ): Promise<UserDto> {
    return this.httpClient.patch(
      `/users/${encodeURIComponent(request.userId)}`,
      _.omit(request, "userId", "userVersion"),
      {
        params: _.pick(request, "userVersion"),
      },
    );
  }
}
```

</details>

## Maintainers

- [@Byndyusoft/owners](https://github.com/orgs/Byndyusoft/teams/owners) <<github.maintain@byndyusoft.com>>
- [@Byndyusoft/team](https://github.com/orgs/Byndyusoft/teams/team)
- [@KillWolfVlad](https://github.com/KillWolfVlad)

## License

This repository is released under version 2.0 of the
[Apache License](https://www.apache.org/licenses/LICENSE-2.0).
