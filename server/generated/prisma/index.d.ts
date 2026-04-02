
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Organization
 * 
 */
export type Organization = $Result.DefaultSelection<Prisma.$OrganizationPayload>
/**
 * Model Workspace
 * 
 */
export type Workspace = $Result.DefaultSelection<Prisma.$WorkspacePayload>
/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model Requirement
 * 
 */
export type Requirement = $Result.DefaultSelection<Prisma.$RequirementPayload>
/**
 * Model Test
 * 
 */
export type Test = $Result.DefaultSelection<Prisma.$TestPayload>
/**
 * Model Risk
 * 
 */
export type Risk = $Result.DefaultSelection<Prisma.$RiskPayload>
/**
 * Model CAPA
 * 
 */
export type CAPA = $Result.DefaultSelection<Prisma.$CAPAPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.organization`: Exposes CRUD operations for the **Organization** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Organizations
    * const organizations = await prisma.organization.findMany()
    * ```
    */
  get organization(): Prisma.OrganizationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.workspace`: Exposes CRUD operations for the **Workspace** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Workspaces
    * const workspaces = await prisma.workspace.findMany()
    * ```
    */
  get workspace(): Prisma.WorkspaceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.requirement`: Exposes CRUD operations for the **Requirement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Requirements
    * const requirements = await prisma.requirement.findMany()
    * ```
    */
  get requirement(): Prisma.RequirementDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.test`: Exposes CRUD operations for the **Test** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tests
    * const tests = await prisma.test.findMany()
    * ```
    */
  get test(): Prisma.TestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.risk`: Exposes CRUD operations for the **Risk** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Risks
    * const risks = await prisma.risk.findMany()
    * ```
    */
  get risk(): Prisma.RiskDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cAPA`: Exposes CRUD operations for the **CAPA** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CAPAS
    * const cAPAS = await prisma.cAPA.findMany()
    * ```
    */
  get cAPA(): Prisma.CAPADelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.6.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Organization: 'Organization',
    Workspace: 'Workspace',
    Project: 'Project',
    Requirement: 'Requirement',
    Test: 'Test',
    Risk: 'Risk',
    CAPA: 'CAPA',
    AuditLog: 'AuditLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "organization" | "workspace" | "project" | "requirement" | "test" | "risk" | "cAPA" | "auditLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Organization: {
        payload: Prisma.$OrganizationPayload<ExtArgs>
        fields: Prisma.OrganizationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrganizationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrganizationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          findFirst: {
            args: Prisma.OrganizationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrganizationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          findMany: {
            args: Prisma.OrganizationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          create: {
            args: Prisma.OrganizationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          createMany: {
            args: Prisma.OrganizationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrganizationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          delete: {
            args: Prisma.OrganizationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          update: {
            args: Prisma.OrganizationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          deleteMany: {
            args: Prisma.OrganizationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrganizationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrganizationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          upsert: {
            args: Prisma.OrganizationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          aggregate: {
            args: Prisma.OrganizationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrganization>
          }
          groupBy: {
            args: Prisma.OrganizationGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrganizationGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrganizationCountArgs<ExtArgs>
            result: $Utils.Optional<OrganizationCountAggregateOutputType> | number
          }
        }
      }
      Workspace: {
        payload: Prisma.$WorkspacePayload<ExtArgs>
        fields: Prisma.WorkspaceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkspaceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkspaceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          findFirst: {
            args: Prisma.WorkspaceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkspaceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          findMany: {
            args: Prisma.WorkspaceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>[]
          }
          create: {
            args: Prisma.WorkspaceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          createMany: {
            args: Prisma.WorkspaceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkspaceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>[]
          }
          delete: {
            args: Prisma.WorkspaceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          update: {
            args: Prisma.WorkspaceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          deleteMany: {
            args: Prisma.WorkspaceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkspaceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WorkspaceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>[]
          }
          upsert: {
            args: Prisma.WorkspaceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          aggregate: {
            args: Prisma.WorkspaceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkspace>
          }
          groupBy: {
            args: Prisma.WorkspaceGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkspaceCountArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceCountAggregateOutputType> | number
          }
        }
      }
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      Requirement: {
        payload: Prisma.$RequirementPayload<ExtArgs>
        fields: Prisma.RequirementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RequirementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequirementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RequirementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequirementPayload>
          }
          findFirst: {
            args: Prisma.RequirementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequirementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RequirementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequirementPayload>
          }
          findMany: {
            args: Prisma.RequirementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequirementPayload>[]
          }
          create: {
            args: Prisma.RequirementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequirementPayload>
          }
          createMany: {
            args: Prisma.RequirementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RequirementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequirementPayload>[]
          }
          delete: {
            args: Prisma.RequirementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequirementPayload>
          }
          update: {
            args: Prisma.RequirementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequirementPayload>
          }
          deleteMany: {
            args: Prisma.RequirementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RequirementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RequirementUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequirementPayload>[]
          }
          upsert: {
            args: Prisma.RequirementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequirementPayload>
          }
          aggregate: {
            args: Prisma.RequirementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRequirement>
          }
          groupBy: {
            args: Prisma.RequirementGroupByArgs<ExtArgs>
            result: $Utils.Optional<RequirementGroupByOutputType>[]
          }
          count: {
            args: Prisma.RequirementCountArgs<ExtArgs>
            result: $Utils.Optional<RequirementCountAggregateOutputType> | number
          }
        }
      }
      Test: {
        payload: Prisma.$TestPayload<ExtArgs>
        fields: Prisma.TestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload>
          }
          findFirst: {
            args: Prisma.TestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload>
          }
          findMany: {
            args: Prisma.TestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload>[]
          }
          create: {
            args: Prisma.TestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload>
          }
          createMany: {
            args: Prisma.TestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload>[]
          }
          delete: {
            args: Prisma.TestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload>
          }
          update: {
            args: Prisma.TestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload>
          }
          deleteMany: {
            args: Prisma.TestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload>[]
          }
          upsert: {
            args: Prisma.TestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload>
          }
          aggregate: {
            args: Prisma.TestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTest>
          }
          groupBy: {
            args: Prisma.TestGroupByArgs<ExtArgs>
            result: $Utils.Optional<TestGroupByOutputType>[]
          }
          count: {
            args: Prisma.TestCountArgs<ExtArgs>
            result: $Utils.Optional<TestCountAggregateOutputType> | number
          }
        }
      }
      Risk: {
        payload: Prisma.$RiskPayload<ExtArgs>
        fields: Prisma.RiskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RiskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RiskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskPayload>
          }
          findFirst: {
            args: Prisma.RiskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RiskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskPayload>
          }
          findMany: {
            args: Prisma.RiskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskPayload>[]
          }
          create: {
            args: Prisma.RiskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskPayload>
          }
          createMany: {
            args: Prisma.RiskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RiskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskPayload>[]
          }
          delete: {
            args: Prisma.RiskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskPayload>
          }
          update: {
            args: Prisma.RiskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskPayload>
          }
          deleteMany: {
            args: Prisma.RiskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RiskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RiskUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskPayload>[]
          }
          upsert: {
            args: Prisma.RiskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RiskPayload>
          }
          aggregate: {
            args: Prisma.RiskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRisk>
          }
          groupBy: {
            args: Prisma.RiskGroupByArgs<ExtArgs>
            result: $Utils.Optional<RiskGroupByOutputType>[]
          }
          count: {
            args: Prisma.RiskCountArgs<ExtArgs>
            result: $Utils.Optional<RiskCountAggregateOutputType> | number
          }
        }
      }
      CAPA: {
        payload: Prisma.$CAPAPayload<ExtArgs>
        fields: Prisma.CAPAFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CAPAFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CAPAPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CAPAFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CAPAPayload>
          }
          findFirst: {
            args: Prisma.CAPAFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CAPAPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CAPAFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CAPAPayload>
          }
          findMany: {
            args: Prisma.CAPAFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CAPAPayload>[]
          }
          create: {
            args: Prisma.CAPACreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CAPAPayload>
          }
          createMany: {
            args: Prisma.CAPACreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CAPACreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CAPAPayload>[]
          }
          delete: {
            args: Prisma.CAPADeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CAPAPayload>
          }
          update: {
            args: Prisma.CAPAUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CAPAPayload>
          }
          deleteMany: {
            args: Prisma.CAPADeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CAPAUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CAPAUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CAPAPayload>[]
          }
          upsert: {
            args: Prisma.CAPAUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CAPAPayload>
          }
          aggregate: {
            args: Prisma.CAPAAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCAPA>
          }
          groupBy: {
            args: Prisma.CAPAGroupByArgs<ExtArgs>
            result: $Utils.Optional<CAPAGroupByOutputType>[]
          }
          count: {
            args: Prisma.CAPACountArgs<ExtArgs>
            result: $Utils.Optional<CAPACountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    organization?: OrganizationOmit
    workspace?: WorkspaceOmit
    project?: ProjectOmit
    requirement?: RequirementOmit
    test?: TestOmit
    risk?: RiskOmit
    cAPA?: CAPAOmit
    auditLog?: AuditLogOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type OrganizationCountOutputType
   */

  export type OrganizationCountOutputType = {
    users: number
    workspaces: number
  }

  export type OrganizationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | OrganizationCountOutputTypeCountUsersArgs
    workspaces?: boolean | OrganizationCountOutputTypeCountWorkspacesArgs
  }

  // Custom InputTypes
  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationCountOutputType
     */
    select?: OrganizationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountWorkspacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceWhereInput
  }


  /**
   * Count Type WorkspaceCountOutputType
   */

  export type WorkspaceCountOutputType = {
    projects: number
  }

  export type WorkspaceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | WorkspaceCountOutputTypeCountProjectsArgs
  }

  // Custom InputTypes
  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceCountOutputType
     */
    select?: WorkspaceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeCountProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    requirements: number
    tests: number
    risks: number
    capas: number
    auditLogs: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requirements?: boolean | ProjectCountOutputTypeCountRequirementsArgs
    tests?: boolean | ProjectCountOutputTypeCountTestsArgs
    risks?: boolean | ProjectCountOutputTypeCountRisksArgs
    capas?: boolean | ProjectCountOutputTypeCountCapasArgs
    auditLogs?: boolean | ProjectCountOutputTypeCountAuditLogsArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountRequirementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RequirementWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountTestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TestWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountRisksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RiskWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountCapasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CAPAWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    name: string | null
    role: string | null
    orgId: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    name: string | null
    role: string | null
    orgId: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    name: number
    role: number
    orgId: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    role?: true
    orgId?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    role?: true
    orgId?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    role?: true
    orgId?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    name: string
    role: string
    orgId: string | null
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    orgId?: boolean
    createdAt?: boolean
    org?: boolean | User$orgArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    orgId?: boolean
    createdAt?: boolean
    org?: boolean | User$orgArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    orgId?: boolean
    createdAt?: boolean
    org?: boolean | User$orgArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    orgId?: boolean
    createdAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "passwordHash" | "name" | "role" | "orgId" | "createdAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    org?: boolean | User$orgArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    org?: boolean | User$orgArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    org?: boolean | User$orgArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      org: Prisma.$OrganizationPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string
      name: string
      role: string
      orgId: string | null
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    org<T extends User$orgArgs<ExtArgs> = {}>(args?: Subset<T, User$orgArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly orgId: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.org
   */
  export type User$orgArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    where?: OrganizationWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Organization
   */

  export type AggregateOrganization = {
    _count: OrganizationCountAggregateOutputType | null
    _min: OrganizationMinAggregateOutputType | null
    _max: OrganizationMaxAggregateOutputType | null
  }

  export type OrganizationMinAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
  }

  export type OrganizationMaxAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
  }

  export type OrganizationCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    _all: number
  }


  export type OrganizationMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
  }

  export type OrganizationMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
  }

  export type OrganizationCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    _all?: true
  }

  export type OrganizationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organization to aggregate.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Organizations
    **/
    _count?: true | OrganizationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrganizationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrganizationMaxAggregateInputType
  }

  export type GetOrganizationAggregateType<T extends OrganizationAggregateArgs> = {
        [P in keyof T & keyof AggregateOrganization]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrganization[P]>
      : GetScalarType<T[P], AggregateOrganization[P]>
  }




  export type OrganizationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganizationWhereInput
    orderBy?: OrganizationOrderByWithAggregationInput | OrganizationOrderByWithAggregationInput[]
    by: OrganizationScalarFieldEnum[] | OrganizationScalarFieldEnum
    having?: OrganizationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrganizationCountAggregateInputType | true
    _min?: OrganizationMinAggregateInputType
    _max?: OrganizationMaxAggregateInputType
  }

  export type OrganizationGroupByOutputType = {
    id: string
    name: string
    createdAt: Date
    _count: OrganizationCountAggregateOutputType | null
    _min: OrganizationMinAggregateOutputType | null
    _max: OrganizationMaxAggregateOutputType | null
  }

  type GetOrganizationGroupByPayload<T extends OrganizationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrganizationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrganizationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrganizationGroupByOutputType[P]>
            : GetScalarType<T[P], OrganizationGroupByOutputType[P]>
        }
      >
    >


  export type OrganizationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    users?: boolean | Organization$usersArgs<ExtArgs>
    workspaces?: boolean | Organization$workspacesArgs<ExtArgs>
    _count?: boolean | OrganizationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
  }

  export type OrganizationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "createdAt", ExtArgs["result"]["organization"]>
  export type OrganizationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Organization$usersArgs<ExtArgs>
    workspaces?: boolean | Organization$workspacesArgs<ExtArgs>
    _count?: boolean | OrganizationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OrganizationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type OrganizationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $OrganizationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Organization"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      workspaces: Prisma.$WorkspacePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      createdAt: Date
    }, ExtArgs["result"]["organization"]>
    composites: {}
  }

  type OrganizationGetPayload<S extends boolean | null | undefined | OrganizationDefaultArgs> = $Result.GetResult<Prisma.$OrganizationPayload, S>

  type OrganizationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrganizationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrganizationCountAggregateInputType | true
    }

  export interface OrganizationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Organization'], meta: { name: 'Organization' } }
    /**
     * Find zero or one Organization that matches the filter.
     * @param {OrganizationFindUniqueArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrganizationFindUniqueArgs>(args: SelectSubset<T, OrganizationFindUniqueArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Organization that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrganizationFindUniqueOrThrowArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrganizationFindUniqueOrThrowArgs>(args: SelectSubset<T, OrganizationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organization that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindFirstArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrganizationFindFirstArgs>(args?: SelectSubset<T, OrganizationFindFirstArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organization that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindFirstOrThrowArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrganizationFindFirstOrThrowArgs>(args?: SelectSubset<T, OrganizationFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Organizations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Organizations
     * const organizations = await prisma.organization.findMany()
     * 
     * // Get first 10 Organizations
     * const organizations = await prisma.organization.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const organizationWithIdOnly = await prisma.organization.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrganizationFindManyArgs>(args?: SelectSubset<T, OrganizationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Organization.
     * @param {OrganizationCreateArgs} args - Arguments to create a Organization.
     * @example
     * // Create one Organization
     * const Organization = await prisma.organization.create({
     *   data: {
     *     // ... data to create a Organization
     *   }
     * })
     * 
     */
    create<T extends OrganizationCreateArgs>(args: SelectSubset<T, OrganizationCreateArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Organizations.
     * @param {OrganizationCreateManyArgs} args - Arguments to create many Organizations.
     * @example
     * // Create many Organizations
     * const organization = await prisma.organization.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrganizationCreateManyArgs>(args?: SelectSubset<T, OrganizationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Organizations and returns the data saved in the database.
     * @param {OrganizationCreateManyAndReturnArgs} args - Arguments to create many Organizations.
     * @example
     * // Create many Organizations
     * const organization = await prisma.organization.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Organizations and only return the `id`
     * const organizationWithIdOnly = await prisma.organization.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrganizationCreateManyAndReturnArgs>(args?: SelectSubset<T, OrganizationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Organization.
     * @param {OrganizationDeleteArgs} args - Arguments to delete one Organization.
     * @example
     * // Delete one Organization
     * const Organization = await prisma.organization.delete({
     *   where: {
     *     // ... filter to delete one Organization
     *   }
     * })
     * 
     */
    delete<T extends OrganizationDeleteArgs>(args: SelectSubset<T, OrganizationDeleteArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Organization.
     * @param {OrganizationUpdateArgs} args - Arguments to update one Organization.
     * @example
     * // Update one Organization
     * const organization = await prisma.organization.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrganizationUpdateArgs>(args: SelectSubset<T, OrganizationUpdateArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Organizations.
     * @param {OrganizationDeleteManyArgs} args - Arguments to filter Organizations to delete.
     * @example
     * // Delete a few Organizations
     * const { count } = await prisma.organization.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrganizationDeleteManyArgs>(args?: SelectSubset<T, OrganizationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Organizations
     * const organization = await prisma.organization.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrganizationUpdateManyArgs>(args: SelectSubset<T, OrganizationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organizations and returns the data updated in the database.
     * @param {OrganizationUpdateManyAndReturnArgs} args - Arguments to update many Organizations.
     * @example
     * // Update many Organizations
     * const organization = await prisma.organization.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Organizations and only return the `id`
     * const organizationWithIdOnly = await prisma.organization.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrganizationUpdateManyAndReturnArgs>(args: SelectSubset<T, OrganizationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Organization.
     * @param {OrganizationUpsertArgs} args - Arguments to update or create a Organization.
     * @example
     * // Update or create a Organization
     * const organization = await prisma.organization.upsert({
     *   create: {
     *     // ... data to create a Organization
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Organization we want to update
     *   }
     * })
     */
    upsert<T extends OrganizationUpsertArgs>(args: SelectSubset<T, OrganizationUpsertArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationCountArgs} args - Arguments to filter Organizations to count.
     * @example
     * // Count the number of Organizations
     * const count = await prisma.organization.count({
     *   where: {
     *     // ... the filter for the Organizations we want to count
     *   }
     * })
    **/
    count<T extends OrganizationCountArgs>(
      args?: Subset<T, OrganizationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrganizationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Organization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrganizationAggregateArgs>(args: Subset<T, OrganizationAggregateArgs>): Prisma.PrismaPromise<GetOrganizationAggregateType<T>>

    /**
     * Group by Organization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrganizationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrganizationGroupByArgs['orderBy'] }
        : { orderBy?: OrganizationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrganizationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganizationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Organization model
   */
  readonly fields: OrganizationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Organization.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrganizationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Organization$usersArgs<ExtArgs> = {}>(args?: Subset<T, Organization$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    workspaces<T extends Organization$workspacesArgs<ExtArgs> = {}>(args?: Subset<T, Organization$workspacesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Organization model
   */
  interface OrganizationFieldRefs {
    readonly id: FieldRef<"Organization", 'String'>
    readonly name: FieldRef<"Organization", 'String'>
    readonly createdAt: FieldRef<"Organization", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Organization findUnique
   */
  export type OrganizationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization findUniqueOrThrow
   */
  export type OrganizationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization findFirst
   */
  export type OrganizationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organizations.
     */
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization findFirstOrThrow
   */
  export type OrganizationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organizations.
     */
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization findMany
   */
  export type OrganizationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organizations to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organizations.
     */
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization create
   */
  export type OrganizationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The data needed to create a Organization.
     */
    data: XOR<OrganizationCreateInput, OrganizationUncheckedCreateInput>
  }

  /**
   * Organization createMany
   */
  export type OrganizationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Organizations.
     */
    data: OrganizationCreateManyInput | OrganizationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Organization createManyAndReturn
   */
  export type OrganizationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * The data used to create many Organizations.
     */
    data: OrganizationCreateManyInput | OrganizationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Organization update
   */
  export type OrganizationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The data needed to update a Organization.
     */
    data: XOR<OrganizationUpdateInput, OrganizationUncheckedUpdateInput>
    /**
     * Choose, which Organization to update.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization updateMany
   */
  export type OrganizationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Organizations.
     */
    data: XOR<OrganizationUpdateManyMutationInput, OrganizationUncheckedUpdateManyInput>
    /**
     * Filter which Organizations to update
     */
    where?: OrganizationWhereInput
    /**
     * Limit how many Organizations to update.
     */
    limit?: number
  }

  /**
   * Organization updateManyAndReturn
   */
  export type OrganizationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * The data used to update Organizations.
     */
    data: XOR<OrganizationUpdateManyMutationInput, OrganizationUncheckedUpdateManyInput>
    /**
     * Filter which Organizations to update
     */
    where?: OrganizationWhereInput
    /**
     * Limit how many Organizations to update.
     */
    limit?: number
  }

  /**
   * Organization upsert
   */
  export type OrganizationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The filter to search for the Organization to update in case it exists.
     */
    where: OrganizationWhereUniqueInput
    /**
     * In case the Organization found by the `where` argument doesn't exist, create a new Organization with this data.
     */
    create: XOR<OrganizationCreateInput, OrganizationUncheckedCreateInput>
    /**
     * In case the Organization was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrganizationUpdateInput, OrganizationUncheckedUpdateInput>
  }

  /**
   * Organization delete
   */
  export type OrganizationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter which Organization to delete.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization deleteMany
   */
  export type OrganizationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organizations to delete
     */
    where?: OrganizationWhereInput
    /**
     * Limit how many Organizations to delete.
     */
    limit?: number
  }

  /**
   * Organization.users
   */
  export type Organization$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Organization.workspaces
   */
  export type Organization$workspacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    where?: WorkspaceWhereInput
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    cursor?: WorkspaceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * Organization without action
   */
  export type OrganizationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
  }


  /**
   * Model Workspace
   */

  export type AggregateWorkspace = {
    _count: WorkspaceCountAggregateOutputType | null
    _min: WorkspaceMinAggregateOutputType | null
    _max: WorkspaceMaxAggregateOutputType | null
  }

  export type WorkspaceMinAggregateOutputType = {
    id: string | null
    name: string | null
    orgId: string | null
    createdAt: Date | null
  }

  export type WorkspaceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    orgId: string | null
    createdAt: Date | null
  }

  export type WorkspaceCountAggregateOutputType = {
    id: number
    name: number
    orgId: number
    createdAt: number
    _all: number
  }


  export type WorkspaceMinAggregateInputType = {
    id?: true
    name?: true
    orgId?: true
    createdAt?: true
  }

  export type WorkspaceMaxAggregateInputType = {
    id?: true
    name?: true
    orgId?: true
    createdAt?: true
  }

  export type WorkspaceCountAggregateInputType = {
    id?: true
    name?: true
    orgId?: true
    createdAt?: true
    _all?: true
  }

  export type WorkspaceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Workspace to aggregate.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Workspaces
    **/
    _count?: true | WorkspaceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkspaceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkspaceMaxAggregateInputType
  }

  export type GetWorkspaceAggregateType<T extends WorkspaceAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkspace]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkspace[P]>
      : GetScalarType<T[P], AggregateWorkspace[P]>
  }




  export type WorkspaceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceWhereInput
    orderBy?: WorkspaceOrderByWithAggregationInput | WorkspaceOrderByWithAggregationInput[]
    by: WorkspaceScalarFieldEnum[] | WorkspaceScalarFieldEnum
    having?: WorkspaceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkspaceCountAggregateInputType | true
    _min?: WorkspaceMinAggregateInputType
    _max?: WorkspaceMaxAggregateInputType
  }

  export type WorkspaceGroupByOutputType = {
    id: string
    name: string
    orgId: string
    createdAt: Date
    _count: WorkspaceCountAggregateOutputType | null
    _min: WorkspaceMinAggregateOutputType | null
    _max: WorkspaceMaxAggregateOutputType | null
  }

  type GetWorkspaceGroupByPayload<T extends WorkspaceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkspaceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkspaceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkspaceGroupByOutputType[P]>
            : GetScalarType<T[P], WorkspaceGroupByOutputType[P]>
        }
      >
    >


  export type WorkspaceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    orgId?: boolean
    createdAt?: boolean
    org?: boolean | OrganizationDefaultArgs<ExtArgs>
    projects?: boolean | Workspace$projectsArgs<ExtArgs>
    _count?: boolean | WorkspaceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspace"]>

  export type WorkspaceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    orgId?: boolean
    createdAt?: boolean
    org?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspace"]>

  export type WorkspaceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    orgId?: boolean
    createdAt?: boolean
    org?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspace"]>

  export type WorkspaceSelectScalar = {
    id?: boolean
    name?: boolean
    orgId?: boolean
    createdAt?: boolean
  }

  export type WorkspaceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "orgId" | "createdAt", ExtArgs["result"]["workspace"]>
  export type WorkspaceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    org?: boolean | OrganizationDefaultArgs<ExtArgs>
    projects?: boolean | Workspace$projectsArgs<ExtArgs>
    _count?: boolean | WorkspaceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WorkspaceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    org?: boolean | OrganizationDefaultArgs<ExtArgs>
  }
  export type WorkspaceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    org?: boolean | OrganizationDefaultArgs<ExtArgs>
  }

  export type $WorkspacePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Workspace"
    objects: {
      org: Prisma.$OrganizationPayload<ExtArgs>
      projects: Prisma.$ProjectPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      orgId: string
      createdAt: Date
    }, ExtArgs["result"]["workspace"]>
    composites: {}
  }

  type WorkspaceGetPayload<S extends boolean | null | undefined | WorkspaceDefaultArgs> = $Result.GetResult<Prisma.$WorkspacePayload, S>

  type WorkspaceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WorkspaceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WorkspaceCountAggregateInputType | true
    }

  export interface WorkspaceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Workspace'], meta: { name: 'Workspace' } }
    /**
     * Find zero or one Workspace that matches the filter.
     * @param {WorkspaceFindUniqueArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkspaceFindUniqueArgs>(args: SelectSubset<T, WorkspaceFindUniqueArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Workspace that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorkspaceFindUniqueOrThrowArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkspaceFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkspaceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Workspace that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceFindFirstArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkspaceFindFirstArgs>(args?: SelectSubset<T, WorkspaceFindFirstArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Workspace that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceFindFirstOrThrowArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkspaceFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkspaceFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Workspaces that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Workspaces
     * const workspaces = await prisma.workspace.findMany()
     * 
     * // Get first 10 Workspaces
     * const workspaces = await prisma.workspace.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workspaceWithIdOnly = await prisma.workspace.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkspaceFindManyArgs>(args?: SelectSubset<T, WorkspaceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Workspace.
     * @param {WorkspaceCreateArgs} args - Arguments to create a Workspace.
     * @example
     * // Create one Workspace
     * const Workspace = await prisma.workspace.create({
     *   data: {
     *     // ... data to create a Workspace
     *   }
     * })
     * 
     */
    create<T extends WorkspaceCreateArgs>(args: SelectSubset<T, WorkspaceCreateArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Workspaces.
     * @param {WorkspaceCreateManyArgs} args - Arguments to create many Workspaces.
     * @example
     * // Create many Workspaces
     * const workspace = await prisma.workspace.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkspaceCreateManyArgs>(args?: SelectSubset<T, WorkspaceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Workspaces and returns the data saved in the database.
     * @param {WorkspaceCreateManyAndReturnArgs} args - Arguments to create many Workspaces.
     * @example
     * // Create many Workspaces
     * const workspace = await prisma.workspace.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Workspaces and only return the `id`
     * const workspaceWithIdOnly = await prisma.workspace.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkspaceCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkspaceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Workspace.
     * @param {WorkspaceDeleteArgs} args - Arguments to delete one Workspace.
     * @example
     * // Delete one Workspace
     * const Workspace = await prisma.workspace.delete({
     *   where: {
     *     // ... filter to delete one Workspace
     *   }
     * })
     * 
     */
    delete<T extends WorkspaceDeleteArgs>(args: SelectSubset<T, WorkspaceDeleteArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Workspace.
     * @param {WorkspaceUpdateArgs} args - Arguments to update one Workspace.
     * @example
     * // Update one Workspace
     * const workspace = await prisma.workspace.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkspaceUpdateArgs>(args: SelectSubset<T, WorkspaceUpdateArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Workspaces.
     * @param {WorkspaceDeleteManyArgs} args - Arguments to filter Workspaces to delete.
     * @example
     * // Delete a few Workspaces
     * const { count } = await prisma.workspace.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkspaceDeleteManyArgs>(args?: SelectSubset<T, WorkspaceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Workspaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Workspaces
     * const workspace = await prisma.workspace.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkspaceUpdateManyArgs>(args: SelectSubset<T, WorkspaceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Workspaces and returns the data updated in the database.
     * @param {WorkspaceUpdateManyAndReturnArgs} args - Arguments to update many Workspaces.
     * @example
     * // Update many Workspaces
     * const workspace = await prisma.workspace.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Workspaces and only return the `id`
     * const workspaceWithIdOnly = await prisma.workspace.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WorkspaceUpdateManyAndReturnArgs>(args: SelectSubset<T, WorkspaceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Workspace.
     * @param {WorkspaceUpsertArgs} args - Arguments to update or create a Workspace.
     * @example
     * // Update or create a Workspace
     * const workspace = await prisma.workspace.upsert({
     *   create: {
     *     // ... data to create a Workspace
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Workspace we want to update
     *   }
     * })
     */
    upsert<T extends WorkspaceUpsertArgs>(args: SelectSubset<T, WorkspaceUpsertArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Workspaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceCountArgs} args - Arguments to filter Workspaces to count.
     * @example
     * // Count the number of Workspaces
     * const count = await prisma.workspace.count({
     *   where: {
     *     // ... the filter for the Workspaces we want to count
     *   }
     * })
    **/
    count<T extends WorkspaceCountArgs>(
      args?: Subset<T, WorkspaceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkspaceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Workspace.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkspaceAggregateArgs>(args: Subset<T, WorkspaceAggregateArgs>): Prisma.PrismaPromise<GetWorkspaceAggregateType<T>>

    /**
     * Group by Workspace.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkspaceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkspaceGroupByArgs['orderBy'] }
        : { orderBy?: WorkspaceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkspaceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkspaceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Workspace model
   */
  readonly fields: WorkspaceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Workspace.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkspaceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    org<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    projects<T extends Workspace$projectsArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Workspace model
   */
  interface WorkspaceFieldRefs {
    readonly id: FieldRef<"Workspace", 'String'>
    readonly name: FieldRef<"Workspace", 'String'>
    readonly orgId: FieldRef<"Workspace", 'String'>
    readonly createdAt: FieldRef<"Workspace", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Workspace findUnique
   */
  export type WorkspaceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace findUniqueOrThrow
   */
  export type WorkspaceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace findFirst
   */
  export type WorkspaceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Workspaces.
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workspaces.
     */
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * Workspace findFirstOrThrow
   */
  export type WorkspaceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Workspaces.
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workspaces.
     */
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * Workspace findMany
   */
  export type WorkspaceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspaces to fetch.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Workspaces.
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workspaces.
     */
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * Workspace create
   */
  export type WorkspaceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * The data needed to create a Workspace.
     */
    data: XOR<WorkspaceCreateInput, WorkspaceUncheckedCreateInput>
  }

  /**
   * Workspace createMany
   */
  export type WorkspaceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Workspaces.
     */
    data: WorkspaceCreateManyInput | WorkspaceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Workspace createManyAndReturn
   */
  export type WorkspaceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * The data used to create many Workspaces.
     */
    data: WorkspaceCreateManyInput | WorkspaceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Workspace update
   */
  export type WorkspaceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * The data needed to update a Workspace.
     */
    data: XOR<WorkspaceUpdateInput, WorkspaceUncheckedUpdateInput>
    /**
     * Choose, which Workspace to update.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace updateMany
   */
  export type WorkspaceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Workspaces.
     */
    data: XOR<WorkspaceUpdateManyMutationInput, WorkspaceUncheckedUpdateManyInput>
    /**
     * Filter which Workspaces to update
     */
    where?: WorkspaceWhereInput
    /**
     * Limit how many Workspaces to update.
     */
    limit?: number
  }

  /**
   * Workspace updateManyAndReturn
   */
  export type WorkspaceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * The data used to update Workspaces.
     */
    data: XOR<WorkspaceUpdateManyMutationInput, WorkspaceUncheckedUpdateManyInput>
    /**
     * Filter which Workspaces to update
     */
    where?: WorkspaceWhereInput
    /**
     * Limit how many Workspaces to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Workspace upsert
   */
  export type WorkspaceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * The filter to search for the Workspace to update in case it exists.
     */
    where: WorkspaceWhereUniqueInput
    /**
     * In case the Workspace found by the `where` argument doesn't exist, create a new Workspace with this data.
     */
    create: XOR<WorkspaceCreateInput, WorkspaceUncheckedCreateInput>
    /**
     * In case the Workspace was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkspaceUpdateInput, WorkspaceUncheckedUpdateInput>
  }

  /**
   * Workspace delete
   */
  export type WorkspaceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter which Workspace to delete.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace deleteMany
   */
  export type WorkspaceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Workspaces to delete
     */
    where?: WorkspaceWhereInput
    /**
     * Limit how many Workspaces to delete.
     */
    limit?: number
  }

  /**
   * Workspace.projects
   */
  export type Workspace$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Workspace without action
   */
  export type WorkspaceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
  }


  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    workspaceId: string | null
    name: string | null
    description: string | null
    owner: string | null
    version: string | null
    country: string | null
    vertical: string | null
    type: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    workspaceId: string | null
    name: string | null
    description: string | null
    owner: string | null
    version: string | null
    country: string | null
    vertical: string | null
    type: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    workspaceId: number
    name: number
    description: number
    owner: number
    version: number
    country: number
    vertical: number
    modules: number
    type: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProjectMinAggregateInputType = {
    id?: true
    workspaceId?: true
    name?: true
    description?: true
    owner?: true
    version?: true
    country?: true
    vertical?: true
    type?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    workspaceId?: true
    name?: true
    description?: true
    owner?: true
    version?: true
    country?: true
    vertical?: true
    type?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    workspaceId?: true
    name?: true
    description?: true
    owner?: true
    version?: true
    country?: true
    vertical?: true
    modules?: true
    type?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    workspaceId: string
    name: string
    description: string
    owner: string
    version: string
    country: string
    vertical: string | null
    modules: string[]
    type: string
    createdAt: Date
    updatedAt: Date
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workspaceId?: boolean
    name?: boolean
    description?: boolean
    owner?: boolean
    version?: boolean
    country?: boolean
    vertical?: boolean
    modules?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    requirements?: boolean | Project$requirementsArgs<ExtArgs>
    tests?: boolean | Project$testsArgs<ExtArgs>
    risks?: boolean | Project$risksArgs<ExtArgs>
    capas?: boolean | Project$capasArgs<ExtArgs>
    auditLogs?: boolean | Project$auditLogsArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workspaceId?: boolean
    name?: boolean
    description?: boolean
    owner?: boolean
    version?: boolean
    country?: boolean
    vertical?: boolean
    modules?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workspaceId?: boolean
    name?: boolean
    description?: boolean
    owner?: boolean
    version?: boolean
    country?: boolean
    vertical?: boolean
    modules?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    workspaceId?: boolean
    name?: boolean
    description?: boolean
    owner?: boolean
    version?: boolean
    country?: boolean
    vertical?: boolean
    modules?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "workspaceId" | "name" | "description" | "owner" | "version" | "country" | "vertical" | "modules" | "type" | "createdAt" | "updatedAt", ExtArgs["result"]["project"]>
  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    requirements?: boolean | Project$requirementsArgs<ExtArgs>
    tests?: boolean | Project$testsArgs<ExtArgs>
    risks?: boolean | Project$risksArgs<ExtArgs>
    capas?: boolean | Project$capasArgs<ExtArgs>
    auditLogs?: boolean | Project$auditLogsArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      workspace: Prisma.$WorkspacePayload<ExtArgs>
      requirements: Prisma.$RequirementPayload<ExtArgs>[]
      tests: Prisma.$TestPayload<ExtArgs>[]
      risks: Prisma.$RiskPayload<ExtArgs>[]
      capas: Prisma.$CAPAPayload<ExtArgs>[]
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      workspaceId: string
      name: string
      description: string
      owner: string
      version: string
      country: string
      vertical: string | null
      modules: string[]
      type: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {ProjectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workspace<T extends WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceDefaultArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    requirements<T extends Project$requirementsArgs<ExtArgs> = {}>(args?: Subset<T, Project$requirementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RequirementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tests<T extends Project$testsArgs<ExtArgs> = {}>(args?: Subset<T, Project$testsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    risks<T extends Project$risksArgs<ExtArgs> = {}>(args?: Subset<T, Project$risksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RiskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    capas<T extends Project$capasArgs<ExtArgs> = {}>(args?: Subset<T, Project$capasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CAPAPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    auditLogs<T extends Project$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, Project$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly workspaceId: FieldRef<"Project", 'String'>
    readonly name: FieldRef<"Project", 'String'>
    readonly description: FieldRef<"Project", 'String'>
    readonly owner: FieldRef<"Project", 'String'>
    readonly version: FieldRef<"Project", 'String'>
    readonly country: FieldRef<"Project", 'String'>
    readonly vertical: FieldRef<"Project", 'String'>
    readonly modules: FieldRef<"Project", 'String[]'>
    readonly type: FieldRef<"Project", 'String'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
    readonly updatedAt: FieldRef<"Project", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project updateManyAndReturn
   */
  export type ProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to delete.
     */
    limit?: number
  }

  /**
   * Project.requirements
   */
  export type Project$requirementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Requirement
     */
    select?: RequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Requirement
     */
    omit?: RequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequirementInclude<ExtArgs> | null
    where?: RequirementWhereInput
    orderBy?: RequirementOrderByWithRelationInput | RequirementOrderByWithRelationInput[]
    cursor?: RequirementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RequirementScalarFieldEnum | RequirementScalarFieldEnum[]
  }

  /**
   * Project.tests
   */
  export type Project$testsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    where?: TestWhereInput
    orderBy?: TestOrderByWithRelationInput | TestOrderByWithRelationInput[]
    cursor?: TestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TestScalarFieldEnum | TestScalarFieldEnum[]
  }

  /**
   * Project.risks
   */
  export type Project$risksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Risk
     */
    select?: RiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Risk
     */
    omit?: RiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiskInclude<ExtArgs> | null
    where?: RiskWhereInput
    orderBy?: RiskOrderByWithRelationInput | RiskOrderByWithRelationInput[]
    cursor?: RiskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RiskScalarFieldEnum | RiskScalarFieldEnum[]
  }

  /**
   * Project.capas
   */
  export type Project$capasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CAPA
     */
    select?: CAPASelect<ExtArgs> | null
    /**
     * Omit specific fields from the CAPA
     */
    omit?: CAPAOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CAPAInclude<ExtArgs> | null
    where?: CAPAWhereInput
    orderBy?: CAPAOrderByWithRelationInput | CAPAOrderByWithRelationInput[]
    cursor?: CAPAWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CAPAScalarFieldEnum | CAPAScalarFieldEnum[]
  }

  /**
   * Project.auditLogs
   */
  export type Project$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model Requirement
   */

  export type AggregateRequirement = {
    _count: RequirementCountAggregateOutputType | null
    _min: RequirementMinAggregateOutputType | null
    _max: RequirementMaxAggregateOutputType | null
  }

  export type RequirementMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    seqId: string | null
    title: string | null
    description: string | null
    status: string | null
    riskLevel: string | null
    regulatoryRef: string | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RequirementMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    seqId: string | null
    title: string | null
    description: string | null
    status: string | null
    riskLevel: string | null
    regulatoryRef: string | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RequirementCountAggregateOutputType = {
    id: number
    projectId: number
    seqId: number
    title: number
    description: number
    status: number
    tags: number
    riskLevel: number
    regulatoryRef: number
    evidenceHints: number
    createdBy: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RequirementMinAggregateInputType = {
    id?: true
    projectId?: true
    seqId?: true
    title?: true
    description?: true
    status?: true
    riskLevel?: true
    regulatoryRef?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RequirementMaxAggregateInputType = {
    id?: true
    projectId?: true
    seqId?: true
    title?: true
    description?: true
    status?: true
    riskLevel?: true
    regulatoryRef?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RequirementCountAggregateInputType = {
    id?: true
    projectId?: true
    seqId?: true
    title?: true
    description?: true
    status?: true
    tags?: true
    riskLevel?: true
    regulatoryRef?: true
    evidenceHints?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RequirementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Requirement to aggregate.
     */
    where?: RequirementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Requirements to fetch.
     */
    orderBy?: RequirementOrderByWithRelationInput | RequirementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RequirementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Requirements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Requirements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Requirements
    **/
    _count?: true | RequirementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RequirementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RequirementMaxAggregateInputType
  }

  export type GetRequirementAggregateType<T extends RequirementAggregateArgs> = {
        [P in keyof T & keyof AggregateRequirement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRequirement[P]>
      : GetScalarType<T[P], AggregateRequirement[P]>
  }




  export type RequirementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RequirementWhereInput
    orderBy?: RequirementOrderByWithAggregationInput | RequirementOrderByWithAggregationInput[]
    by: RequirementScalarFieldEnum[] | RequirementScalarFieldEnum
    having?: RequirementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RequirementCountAggregateInputType | true
    _min?: RequirementMinAggregateInputType
    _max?: RequirementMaxAggregateInputType
  }

  export type RequirementGroupByOutputType = {
    id: string
    projectId: string
    seqId: string
    title: string
    description: string
    status: string
    tags: string[]
    riskLevel: string | null
    regulatoryRef: string | null
    evidenceHints: string[]
    createdBy: string | null
    createdAt: Date
    updatedAt: Date
    _count: RequirementCountAggregateOutputType | null
    _min: RequirementMinAggregateOutputType | null
    _max: RequirementMaxAggregateOutputType | null
  }

  type GetRequirementGroupByPayload<T extends RequirementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RequirementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RequirementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RequirementGroupByOutputType[P]>
            : GetScalarType<T[P], RequirementGroupByOutputType[P]>
        }
      >
    >


  export type RequirementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    seqId?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    tags?: boolean
    riskLevel?: boolean
    regulatoryRef?: boolean
    evidenceHints?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["requirement"]>

  export type RequirementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    seqId?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    tags?: boolean
    riskLevel?: boolean
    regulatoryRef?: boolean
    evidenceHints?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["requirement"]>

  export type RequirementSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    seqId?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    tags?: boolean
    riskLevel?: boolean
    regulatoryRef?: boolean
    evidenceHints?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["requirement"]>

  export type RequirementSelectScalar = {
    id?: boolean
    projectId?: boolean
    seqId?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    tags?: boolean
    riskLevel?: boolean
    regulatoryRef?: boolean
    evidenceHints?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RequirementOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "seqId" | "title" | "description" | "status" | "tags" | "riskLevel" | "regulatoryRef" | "evidenceHints" | "createdBy" | "createdAt" | "updatedAt", ExtArgs["result"]["requirement"]>
  export type RequirementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type RequirementIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type RequirementIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $RequirementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Requirement"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      seqId: string
      title: string
      description: string
      status: string
      tags: string[]
      riskLevel: string | null
      regulatoryRef: string | null
      evidenceHints: string[]
      createdBy: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["requirement"]>
    composites: {}
  }

  type RequirementGetPayload<S extends boolean | null | undefined | RequirementDefaultArgs> = $Result.GetResult<Prisma.$RequirementPayload, S>

  type RequirementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RequirementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RequirementCountAggregateInputType | true
    }

  export interface RequirementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Requirement'], meta: { name: 'Requirement' } }
    /**
     * Find zero or one Requirement that matches the filter.
     * @param {RequirementFindUniqueArgs} args - Arguments to find a Requirement
     * @example
     * // Get one Requirement
     * const requirement = await prisma.requirement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RequirementFindUniqueArgs>(args: SelectSubset<T, RequirementFindUniqueArgs<ExtArgs>>): Prisma__RequirementClient<$Result.GetResult<Prisma.$RequirementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Requirement that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RequirementFindUniqueOrThrowArgs} args - Arguments to find a Requirement
     * @example
     * // Get one Requirement
     * const requirement = await prisma.requirement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RequirementFindUniqueOrThrowArgs>(args: SelectSubset<T, RequirementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RequirementClient<$Result.GetResult<Prisma.$RequirementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Requirement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequirementFindFirstArgs} args - Arguments to find a Requirement
     * @example
     * // Get one Requirement
     * const requirement = await prisma.requirement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RequirementFindFirstArgs>(args?: SelectSubset<T, RequirementFindFirstArgs<ExtArgs>>): Prisma__RequirementClient<$Result.GetResult<Prisma.$RequirementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Requirement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequirementFindFirstOrThrowArgs} args - Arguments to find a Requirement
     * @example
     * // Get one Requirement
     * const requirement = await prisma.requirement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RequirementFindFirstOrThrowArgs>(args?: SelectSubset<T, RequirementFindFirstOrThrowArgs<ExtArgs>>): Prisma__RequirementClient<$Result.GetResult<Prisma.$RequirementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Requirements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequirementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Requirements
     * const requirements = await prisma.requirement.findMany()
     * 
     * // Get first 10 Requirements
     * const requirements = await prisma.requirement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const requirementWithIdOnly = await prisma.requirement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RequirementFindManyArgs>(args?: SelectSubset<T, RequirementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RequirementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Requirement.
     * @param {RequirementCreateArgs} args - Arguments to create a Requirement.
     * @example
     * // Create one Requirement
     * const Requirement = await prisma.requirement.create({
     *   data: {
     *     // ... data to create a Requirement
     *   }
     * })
     * 
     */
    create<T extends RequirementCreateArgs>(args: SelectSubset<T, RequirementCreateArgs<ExtArgs>>): Prisma__RequirementClient<$Result.GetResult<Prisma.$RequirementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Requirements.
     * @param {RequirementCreateManyArgs} args - Arguments to create many Requirements.
     * @example
     * // Create many Requirements
     * const requirement = await prisma.requirement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RequirementCreateManyArgs>(args?: SelectSubset<T, RequirementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Requirements and returns the data saved in the database.
     * @param {RequirementCreateManyAndReturnArgs} args - Arguments to create many Requirements.
     * @example
     * // Create many Requirements
     * const requirement = await prisma.requirement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Requirements and only return the `id`
     * const requirementWithIdOnly = await prisma.requirement.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RequirementCreateManyAndReturnArgs>(args?: SelectSubset<T, RequirementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RequirementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Requirement.
     * @param {RequirementDeleteArgs} args - Arguments to delete one Requirement.
     * @example
     * // Delete one Requirement
     * const Requirement = await prisma.requirement.delete({
     *   where: {
     *     // ... filter to delete one Requirement
     *   }
     * })
     * 
     */
    delete<T extends RequirementDeleteArgs>(args: SelectSubset<T, RequirementDeleteArgs<ExtArgs>>): Prisma__RequirementClient<$Result.GetResult<Prisma.$RequirementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Requirement.
     * @param {RequirementUpdateArgs} args - Arguments to update one Requirement.
     * @example
     * // Update one Requirement
     * const requirement = await prisma.requirement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RequirementUpdateArgs>(args: SelectSubset<T, RequirementUpdateArgs<ExtArgs>>): Prisma__RequirementClient<$Result.GetResult<Prisma.$RequirementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Requirements.
     * @param {RequirementDeleteManyArgs} args - Arguments to filter Requirements to delete.
     * @example
     * // Delete a few Requirements
     * const { count } = await prisma.requirement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RequirementDeleteManyArgs>(args?: SelectSubset<T, RequirementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Requirements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequirementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Requirements
     * const requirement = await prisma.requirement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RequirementUpdateManyArgs>(args: SelectSubset<T, RequirementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Requirements and returns the data updated in the database.
     * @param {RequirementUpdateManyAndReturnArgs} args - Arguments to update many Requirements.
     * @example
     * // Update many Requirements
     * const requirement = await prisma.requirement.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Requirements and only return the `id`
     * const requirementWithIdOnly = await prisma.requirement.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RequirementUpdateManyAndReturnArgs>(args: SelectSubset<T, RequirementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RequirementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Requirement.
     * @param {RequirementUpsertArgs} args - Arguments to update or create a Requirement.
     * @example
     * // Update or create a Requirement
     * const requirement = await prisma.requirement.upsert({
     *   create: {
     *     // ... data to create a Requirement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Requirement we want to update
     *   }
     * })
     */
    upsert<T extends RequirementUpsertArgs>(args: SelectSubset<T, RequirementUpsertArgs<ExtArgs>>): Prisma__RequirementClient<$Result.GetResult<Prisma.$RequirementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Requirements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequirementCountArgs} args - Arguments to filter Requirements to count.
     * @example
     * // Count the number of Requirements
     * const count = await prisma.requirement.count({
     *   where: {
     *     // ... the filter for the Requirements we want to count
     *   }
     * })
    **/
    count<T extends RequirementCountArgs>(
      args?: Subset<T, RequirementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RequirementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Requirement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequirementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RequirementAggregateArgs>(args: Subset<T, RequirementAggregateArgs>): Prisma.PrismaPromise<GetRequirementAggregateType<T>>

    /**
     * Group by Requirement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequirementGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RequirementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RequirementGroupByArgs['orderBy'] }
        : { orderBy?: RequirementGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RequirementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRequirementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Requirement model
   */
  readonly fields: RequirementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Requirement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RequirementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Requirement model
   */
  interface RequirementFieldRefs {
    readonly id: FieldRef<"Requirement", 'String'>
    readonly projectId: FieldRef<"Requirement", 'String'>
    readonly seqId: FieldRef<"Requirement", 'String'>
    readonly title: FieldRef<"Requirement", 'String'>
    readonly description: FieldRef<"Requirement", 'String'>
    readonly status: FieldRef<"Requirement", 'String'>
    readonly tags: FieldRef<"Requirement", 'String[]'>
    readonly riskLevel: FieldRef<"Requirement", 'String'>
    readonly regulatoryRef: FieldRef<"Requirement", 'String'>
    readonly evidenceHints: FieldRef<"Requirement", 'String[]'>
    readonly createdBy: FieldRef<"Requirement", 'String'>
    readonly createdAt: FieldRef<"Requirement", 'DateTime'>
    readonly updatedAt: FieldRef<"Requirement", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Requirement findUnique
   */
  export type RequirementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Requirement
     */
    select?: RequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Requirement
     */
    omit?: RequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequirementInclude<ExtArgs> | null
    /**
     * Filter, which Requirement to fetch.
     */
    where: RequirementWhereUniqueInput
  }

  /**
   * Requirement findUniqueOrThrow
   */
  export type RequirementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Requirement
     */
    select?: RequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Requirement
     */
    omit?: RequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequirementInclude<ExtArgs> | null
    /**
     * Filter, which Requirement to fetch.
     */
    where: RequirementWhereUniqueInput
  }

  /**
   * Requirement findFirst
   */
  export type RequirementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Requirement
     */
    select?: RequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Requirement
     */
    omit?: RequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequirementInclude<ExtArgs> | null
    /**
     * Filter, which Requirement to fetch.
     */
    where?: RequirementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Requirements to fetch.
     */
    orderBy?: RequirementOrderByWithRelationInput | RequirementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Requirements.
     */
    cursor?: RequirementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Requirements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Requirements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Requirements.
     */
    distinct?: RequirementScalarFieldEnum | RequirementScalarFieldEnum[]
  }

  /**
   * Requirement findFirstOrThrow
   */
  export type RequirementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Requirement
     */
    select?: RequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Requirement
     */
    omit?: RequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequirementInclude<ExtArgs> | null
    /**
     * Filter, which Requirement to fetch.
     */
    where?: RequirementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Requirements to fetch.
     */
    orderBy?: RequirementOrderByWithRelationInput | RequirementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Requirements.
     */
    cursor?: RequirementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Requirements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Requirements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Requirements.
     */
    distinct?: RequirementScalarFieldEnum | RequirementScalarFieldEnum[]
  }

  /**
   * Requirement findMany
   */
  export type RequirementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Requirement
     */
    select?: RequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Requirement
     */
    omit?: RequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequirementInclude<ExtArgs> | null
    /**
     * Filter, which Requirements to fetch.
     */
    where?: RequirementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Requirements to fetch.
     */
    orderBy?: RequirementOrderByWithRelationInput | RequirementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Requirements.
     */
    cursor?: RequirementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Requirements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Requirements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Requirements.
     */
    distinct?: RequirementScalarFieldEnum | RequirementScalarFieldEnum[]
  }

  /**
   * Requirement create
   */
  export type RequirementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Requirement
     */
    select?: RequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Requirement
     */
    omit?: RequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequirementInclude<ExtArgs> | null
    /**
     * The data needed to create a Requirement.
     */
    data: XOR<RequirementCreateInput, RequirementUncheckedCreateInput>
  }

  /**
   * Requirement createMany
   */
  export type RequirementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Requirements.
     */
    data: RequirementCreateManyInput | RequirementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Requirement createManyAndReturn
   */
  export type RequirementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Requirement
     */
    select?: RequirementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Requirement
     */
    omit?: RequirementOmit<ExtArgs> | null
    /**
     * The data used to create many Requirements.
     */
    data: RequirementCreateManyInput | RequirementCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequirementIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Requirement update
   */
  export type RequirementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Requirement
     */
    select?: RequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Requirement
     */
    omit?: RequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequirementInclude<ExtArgs> | null
    /**
     * The data needed to update a Requirement.
     */
    data: XOR<RequirementUpdateInput, RequirementUncheckedUpdateInput>
    /**
     * Choose, which Requirement to update.
     */
    where: RequirementWhereUniqueInput
  }

  /**
   * Requirement updateMany
   */
  export type RequirementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Requirements.
     */
    data: XOR<RequirementUpdateManyMutationInput, RequirementUncheckedUpdateManyInput>
    /**
     * Filter which Requirements to update
     */
    where?: RequirementWhereInput
    /**
     * Limit how many Requirements to update.
     */
    limit?: number
  }

  /**
   * Requirement updateManyAndReturn
   */
  export type RequirementUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Requirement
     */
    select?: RequirementSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Requirement
     */
    omit?: RequirementOmit<ExtArgs> | null
    /**
     * The data used to update Requirements.
     */
    data: XOR<RequirementUpdateManyMutationInput, RequirementUncheckedUpdateManyInput>
    /**
     * Filter which Requirements to update
     */
    where?: RequirementWhereInput
    /**
     * Limit how many Requirements to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequirementIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Requirement upsert
   */
  export type RequirementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Requirement
     */
    select?: RequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Requirement
     */
    omit?: RequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequirementInclude<ExtArgs> | null
    /**
     * The filter to search for the Requirement to update in case it exists.
     */
    where: RequirementWhereUniqueInput
    /**
     * In case the Requirement found by the `where` argument doesn't exist, create a new Requirement with this data.
     */
    create: XOR<RequirementCreateInput, RequirementUncheckedCreateInput>
    /**
     * In case the Requirement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RequirementUpdateInput, RequirementUncheckedUpdateInput>
  }

  /**
   * Requirement delete
   */
  export type RequirementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Requirement
     */
    select?: RequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Requirement
     */
    omit?: RequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequirementInclude<ExtArgs> | null
    /**
     * Filter which Requirement to delete.
     */
    where: RequirementWhereUniqueInput
  }

  /**
   * Requirement deleteMany
   */
  export type RequirementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Requirements to delete
     */
    where?: RequirementWhereInput
    /**
     * Limit how many Requirements to delete.
     */
    limit?: number
  }

  /**
   * Requirement without action
   */
  export type RequirementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Requirement
     */
    select?: RequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Requirement
     */
    omit?: RequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequirementInclude<ExtArgs> | null
  }


  /**
   * Model Test
   */

  export type AggregateTest = {
    _count: TestCountAggregateOutputType | null
    _min: TestMinAggregateOutputType | null
    _max: TestMaxAggregateOutputType | null
  }

  export type TestMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    seqId: string | null
    title: string | null
    description: string | null
    status: string | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TestMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    seqId: string | null
    title: string | null
    description: string | null
    status: string | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TestCountAggregateOutputType = {
    id: number
    projectId: number
    seqId: number
    title: number
    description: number
    status: number
    linkedRequirementIds: number
    createdBy: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TestMinAggregateInputType = {
    id?: true
    projectId?: true
    seqId?: true
    title?: true
    description?: true
    status?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TestMaxAggregateInputType = {
    id?: true
    projectId?: true
    seqId?: true
    title?: true
    description?: true
    status?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TestCountAggregateInputType = {
    id?: true
    projectId?: true
    seqId?: true
    title?: true
    description?: true
    status?: true
    linkedRequirementIds?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Test to aggregate.
     */
    where?: TestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tests to fetch.
     */
    orderBy?: TestOrderByWithRelationInput | TestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tests
    **/
    _count?: true | TestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TestMaxAggregateInputType
  }

  export type GetTestAggregateType<T extends TestAggregateArgs> = {
        [P in keyof T & keyof AggregateTest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTest[P]>
      : GetScalarType<T[P], AggregateTest[P]>
  }




  export type TestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TestWhereInput
    orderBy?: TestOrderByWithAggregationInput | TestOrderByWithAggregationInput[]
    by: TestScalarFieldEnum[] | TestScalarFieldEnum
    having?: TestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TestCountAggregateInputType | true
    _min?: TestMinAggregateInputType
    _max?: TestMaxAggregateInputType
  }

  export type TestGroupByOutputType = {
    id: string
    projectId: string
    seqId: string
    title: string
    description: string
    status: string
    linkedRequirementIds: string[]
    createdBy: string | null
    createdAt: Date
    updatedAt: Date
    _count: TestCountAggregateOutputType | null
    _min: TestMinAggregateOutputType | null
    _max: TestMaxAggregateOutputType | null
  }

  type GetTestGroupByPayload<T extends TestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TestGroupByOutputType[P]>
            : GetScalarType<T[P], TestGroupByOutputType[P]>
        }
      >
    >


  export type TestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    seqId?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    linkedRequirementIds?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["test"]>

  export type TestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    seqId?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    linkedRequirementIds?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["test"]>

  export type TestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    seqId?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    linkedRequirementIds?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["test"]>

  export type TestSelectScalar = {
    id?: boolean
    projectId?: boolean
    seqId?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    linkedRequirementIds?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "seqId" | "title" | "description" | "status" | "linkedRequirementIds" | "createdBy" | "createdAt" | "updatedAt", ExtArgs["result"]["test"]>
  export type TestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type TestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type TestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $TestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Test"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      seqId: string
      title: string
      description: string
      status: string
      linkedRequirementIds: string[]
      createdBy: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["test"]>
    composites: {}
  }

  type TestGetPayload<S extends boolean | null | undefined | TestDefaultArgs> = $Result.GetResult<Prisma.$TestPayload, S>

  type TestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TestCountAggregateInputType | true
    }

  export interface TestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Test'], meta: { name: 'Test' } }
    /**
     * Find zero or one Test that matches the filter.
     * @param {TestFindUniqueArgs} args - Arguments to find a Test
     * @example
     * // Get one Test
     * const test = await prisma.test.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TestFindUniqueArgs>(args: SelectSubset<T, TestFindUniqueArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Test that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TestFindUniqueOrThrowArgs} args - Arguments to find a Test
     * @example
     * // Get one Test
     * const test = await prisma.test.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TestFindUniqueOrThrowArgs>(args: SelectSubset<T, TestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Test that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestFindFirstArgs} args - Arguments to find a Test
     * @example
     * // Get one Test
     * const test = await prisma.test.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TestFindFirstArgs>(args?: SelectSubset<T, TestFindFirstArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Test that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestFindFirstOrThrowArgs} args - Arguments to find a Test
     * @example
     * // Get one Test
     * const test = await prisma.test.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TestFindFirstOrThrowArgs>(args?: SelectSubset<T, TestFindFirstOrThrowArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tests
     * const tests = await prisma.test.findMany()
     * 
     * // Get first 10 Tests
     * const tests = await prisma.test.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const testWithIdOnly = await prisma.test.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TestFindManyArgs>(args?: SelectSubset<T, TestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Test.
     * @param {TestCreateArgs} args - Arguments to create a Test.
     * @example
     * // Create one Test
     * const Test = await prisma.test.create({
     *   data: {
     *     // ... data to create a Test
     *   }
     * })
     * 
     */
    create<T extends TestCreateArgs>(args: SelectSubset<T, TestCreateArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tests.
     * @param {TestCreateManyArgs} args - Arguments to create many Tests.
     * @example
     * // Create many Tests
     * const test = await prisma.test.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TestCreateManyArgs>(args?: SelectSubset<T, TestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tests and returns the data saved in the database.
     * @param {TestCreateManyAndReturnArgs} args - Arguments to create many Tests.
     * @example
     * // Create many Tests
     * const test = await prisma.test.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tests and only return the `id`
     * const testWithIdOnly = await prisma.test.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TestCreateManyAndReturnArgs>(args?: SelectSubset<T, TestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Test.
     * @param {TestDeleteArgs} args - Arguments to delete one Test.
     * @example
     * // Delete one Test
     * const Test = await prisma.test.delete({
     *   where: {
     *     // ... filter to delete one Test
     *   }
     * })
     * 
     */
    delete<T extends TestDeleteArgs>(args: SelectSubset<T, TestDeleteArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Test.
     * @param {TestUpdateArgs} args - Arguments to update one Test.
     * @example
     * // Update one Test
     * const test = await prisma.test.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TestUpdateArgs>(args: SelectSubset<T, TestUpdateArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tests.
     * @param {TestDeleteManyArgs} args - Arguments to filter Tests to delete.
     * @example
     * // Delete a few Tests
     * const { count } = await prisma.test.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TestDeleteManyArgs>(args?: SelectSubset<T, TestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tests
     * const test = await prisma.test.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TestUpdateManyArgs>(args: SelectSubset<T, TestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tests and returns the data updated in the database.
     * @param {TestUpdateManyAndReturnArgs} args - Arguments to update many Tests.
     * @example
     * // Update many Tests
     * const test = await prisma.test.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tests and only return the `id`
     * const testWithIdOnly = await prisma.test.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TestUpdateManyAndReturnArgs>(args: SelectSubset<T, TestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Test.
     * @param {TestUpsertArgs} args - Arguments to update or create a Test.
     * @example
     * // Update or create a Test
     * const test = await prisma.test.upsert({
     *   create: {
     *     // ... data to create a Test
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Test we want to update
     *   }
     * })
     */
    upsert<T extends TestUpsertArgs>(args: SelectSubset<T, TestUpsertArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestCountArgs} args - Arguments to filter Tests to count.
     * @example
     * // Count the number of Tests
     * const count = await prisma.test.count({
     *   where: {
     *     // ... the filter for the Tests we want to count
     *   }
     * })
    **/
    count<T extends TestCountArgs>(
      args?: Subset<T, TestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Test.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TestAggregateArgs>(args: Subset<T, TestAggregateArgs>): Prisma.PrismaPromise<GetTestAggregateType<T>>

    /**
     * Group by Test.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TestGroupByArgs['orderBy'] }
        : { orderBy?: TestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Test model
   */
  readonly fields: TestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Test.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Test model
   */
  interface TestFieldRefs {
    readonly id: FieldRef<"Test", 'String'>
    readonly projectId: FieldRef<"Test", 'String'>
    readonly seqId: FieldRef<"Test", 'String'>
    readonly title: FieldRef<"Test", 'String'>
    readonly description: FieldRef<"Test", 'String'>
    readonly status: FieldRef<"Test", 'String'>
    readonly linkedRequirementIds: FieldRef<"Test", 'String[]'>
    readonly createdBy: FieldRef<"Test", 'String'>
    readonly createdAt: FieldRef<"Test", 'DateTime'>
    readonly updatedAt: FieldRef<"Test", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Test findUnique
   */
  export type TestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    /**
     * Filter, which Test to fetch.
     */
    where: TestWhereUniqueInput
  }

  /**
   * Test findUniqueOrThrow
   */
  export type TestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    /**
     * Filter, which Test to fetch.
     */
    where: TestWhereUniqueInput
  }

  /**
   * Test findFirst
   */
  export type TestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    /**
     * Filter, which Test to fetch.
     */
    where?: TestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tests to fetch.
     */
    orderBy?: TestOrderByWithRelationInput | TestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tests.
     */
    cursor?: TestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tests.
     */
    distinct?: TestScalarFieldEnum | TestScalarFieldEnum[]
  }

  /**
   * Test findFirstOrThrow
   */
  export type TestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    /**
     * Filter, which Test to fetch.
     */
    where?: TestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tests to fetch.
     */
    orderBy?: TestOrderByWithRelationInput | TestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tests.
     */
    cursor?: TestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tests.
     */
    distinct?: TestScalarFieldEnum | TestScalarFieldEnum[]
  }

  /**
   * Test findMany
   */
  export type TestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    /**
     * Filter, which Tests to fetch.
     */
    where?: TestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tests to fetch.
     */
    orderBy?: TestOrderByWithRelationInput | TestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tests.
     */
    cursor?: TestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tests.
     */
    distinct?: TestScalarFieldEnum | TestScalarFieldEnum[]
  }

  /**
   * Test create
   */
  export type TestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    /**
     * The data needed to create a Test.
     */
    data: XOR<TestCreateInput, TestUncheckedCreateInput>
  }

  /**
   * Test createMany
   */
  export type TestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tests.
     */
    data: TestCreateManyInput | TestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Test createManyAndReturn
   */
  export type TestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * The data used to create many Tests.
     */
    data: TestCreateManyInput | TestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Test update
   */
  export type TestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    /**
     * The data needed to update a Test.
     */
    data: XOR<TestUpdateInput, TestUncheckedUpdateInput>
    /**
     * Choose, which Test to update.
     */
    where: TestWhereUniqueInput
  }

  /**
   * Test updateMany
   */
  export type TestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tests.
     */
    data: XOR<TestUpdateManyMutationInput, TestUncheckedUpdateManyInput>
    /**
     * Filter which Tests to update
     */
    where?: TestWhereInput
    /**
     * Limit how many Tests to update.
     */
    limit?: number
  }

  /**
   * Test updateManyAndReturn
   */
  export type TestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * The data used to update Tests.
     */
    data: XOR<TestUpdateManyMutationInput, TestUncheckedUpdateManyInput>
    /**
     * Filter which Tests to update
     */
    where?: TestWhereInput
    /**
     * Limit how many Tests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Test upsert
   */
  export type TestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    /**
     * The filter to search for the Test to update in case it exists.
     */
    where: TestWhereUniqueInput
    /**
     * In case the Test found by the `where` argument doesn't exist, create a new Test with this data.
     */
    create: XOR<TestCreateInput, TestUncheckedCreateInput>
    /**
     * In case the Test was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TestUpdateInput, TestUncheckedUpdateInput>
  }

  /**
   * Test delete
   */
  export type TestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    /**
     * Filter which Test to delete.
     */
    where: TestWhereUniqueInput
  }

  /**
   * Test deleteMany
   */
  export type TestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tests to delete
     */
    where?: TestWhereInput
    /**
     * Limit how many Tests to delete.
     */
    limit?: number
  }

  /**
   * Test without action
   */
  export type TestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
  }


  /**
   * Model Risk
   */

  export type AggregateRisk = {
    _count: RiskCountAggregateOutputType | null
    _avg: RiskAvgAggregateOutputType | null
    _sum: RiskSumAggregateOutputType | null
    _min: RiskMinAggregateOutputType | null
    _max: RiskMaxAggregateOutputType | null
  }

  export type RiskAvgAggregateOutputType = {
    severity: number | null
    likelihood: number | null
    detectability: number | null
    riskScore: number | null
    residualRisk: number | null
  }

  export type RiskSumAggregateOutputType = {
    severity: number | null
    likelihood: number | null
    detectability: number | null
    riskScore: number | null
    residualRisk: number | null
  }

  export type RiskMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    requirementId: string | null
    severity: number | null
    likelihood: number | null
    detectability: number | null
    riskScore: number | null
    riskLevel: string | null
    mitigation: string | null
    residualRisk: number | null
    classifiedBy: string | null
    createdAt: Date | null
  }

  export type RiskMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    requirementId: string | null
    severity: number | null
    likelihood: number | null
    detectability: number | null
    riskScore: number | null
    riskLevel: string | null
    mitigation: string | null
    residualRisk: number | null
    classifiedBy: string | null
    createdAt: Date | null
  }

  export type RiskCountAggregateOutputType = {
    id: number
    projectId: number
    requirementId: number
    severity: number
    likelihood: number
    detectability: number
    riskScore: number
    riskLevel: number
    mitigation: number
    residualRisk: number
    classifiedBy: number
    createdAt: number
    _all: number
  }


  export type RiskAvgAggregateInputType = {
    severity?: true
    likelihood?: true
    detectability?: true
    riskScore?: true
    residualRisk?: true
  }

  export type RiskSumAggregateInputType = {
    severity?: true
    likelihood?: true
    detectability?: true
    riskScore?: true
    residualRisk?: true
  }

  export type RiskMinAggregateInputType = {
    id?: true
    projectId?: true
    requirementId?: true
    severity?: true
    likelihood?: true
    detectability?: true
    riskScore?: true
    riskLevel?: true
    mitigation?: true
    residualRisk?: true
    classifiedBy?: true
    createdAt?: true
  }

  export type RiskMaxAggregateInputType = {
    id?: true
    projectId?: true
    requirementId?: true
    severity?: true
    likelihood?: true
    detectability?: true
    riskScore?: true
    riskLevel?: true
    mitigation?: true
    residualRisk?: true
    classifiedBy?: true
    createdAt?: true
  }

  export type RiskCountAggregateInputType = {
    id?: true
    projectId?: true
    requirementId?: true
    severity?: true
    likelihood?: true
    detectability?: true
    riskScore?: true
    riskLevel?: true
    mitigation?: true
    residualRisk?: true
    classifiedBy?: true
    createdAt?: true
    _all?: true
  }

  export type RiskAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Risk to aggregate.
     */
    where?: RiskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Risks to fetch.
     */
    orderBy?: RiskOrderByWithRelationInput | RiskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RiskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Risks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Risks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Risks
    **/
    _count?: true | RiskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RiskAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RiskSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RiskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RiskMaxAggregateInputType
  }

  export type GetRiskAggregateType<T extends RiskAggregateArgs> = {
        [P in keyof T & keyof AggregateRisk]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRisk[P]>
      : GetScalarType<T[P], AggregateRisk[P]>
  }




  export type RiskGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RiskWhereInput
    orderBy?: RiskOrderByWithAggregationInput | RiskOrderByWithAggregationInput[]
    by: RiskScalarFieldEnum[] | RiskScalarFieldEnum
    having?: RiskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RiskCountAggregateInputType | true
    _avg?: RiskAvgAggregateInputType
    _sum?: RiskSumAggregateInputType
    _min?: RiskMinAggregateInputType
    _max?: RiskMaxAggregateInputType
  }

  export type RiskGroupByOutputType = {
    id: string
    projectId: string
    requirementId: string
    severity: number
    likelihood: number
    detectability: number | null
    riskScore: number
    riskLevel: string
    mitigation: string | null
    residualRisk: number | null
    classifiedBy: string
    createdAt: Date
    _count: RiskCountAggregateOutputType | null
    _avg: RiskAvgAggregateOutputType | null
    _sum: RiskSumAggregateOutputType | null
    _min: RiskMinAggregateOutputType | null
    _max: RiskMaxAggregateOutputType | null
  }

  type GetRiskGroupByPayload<T extends RiskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RiskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RiskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RiskGroupByOutputType[P]>
            : GetScalarType<T[P], RiskGroupByOutputType[P]>
        }
      >
    >


  export type RiskSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    requirementId?: boolean
    severity?: boolean
    likelihood?: boolean
    detectability?: boolean
    riskScore?: boolean
    riskLevel?: boolean
    mitigation?: boolean
    residualRisk?: boolean
    classifiedBy?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["risk"]>

  export type RiskSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    requirementId?: boolean
    severity?: boolean
    likelihood?: boolean
    detectability?: boolean
    riskScore?: boolean
    riskLevel?: boolean
    mitigation?: boolean
    residualRisk?: boolean
    classifiedBy?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["risk"]>

  export type RiskSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    requirementId?: boolean
    severity?: boolean
    likelihood?: boolean
    detectability?: boolean
    riskScore?: boolean
    riskLevel?: boolean
    mitigation?: boolean
    residualRisk?: boolean
    classifiedBy?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["risk"]>

  export type RiskSelectScalar = {
    id?: boolean
    projectId?: boolean
    requirementId?: boolean
    severity?: boolean
    likelihood?: boolean
    detectability?: boolean
    riskScore?: boolean
    riskLevel?: boolean
    mitigation?: boolean
    residualRisk?: boolean
    classifiedBy?: boolean
    createdAt?: boolean
  }

  export type RiskOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "requirementId" | "severity" | "likelihood" | "detectability" | "riskScore" | "riskLevel" | "mitigation" | "residualRisk" | "classifiedBy" | "createdAt", ExtArgs["result"]["risk"]>
  export type RiskInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type RiskIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type RiskIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $RiskPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Risk"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      requirementId: string
      severity: number
      likelihood: number
      detectability: number | null
      riskScore: number
      riskLevel: string
      mitigation: string | null
      residualRisk: number | null
      classifiedBy: string
      createdAt: Date
    }, ExtArgs["result"]["risk"]>
    composites: {}
  }

  type RiskGetPayload<S extends boolean | null | undefined | RiskDefaultArgs> = $Result.GetResult<Prisma.$RiskPayload, S>

  type RiskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RiskFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RiskCountAggregateInputType | true
    }

  export interface RiskDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Risk'], meta: { name: 'Risk' } }
    /**
     * Find zero or one Risk that matches the filter.
     * @param {RiskFindUniqueArgs} args - Arguments to find a Risk
     * @example
     * // Get one Risk
     * const risk = await prisma.risk.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RiskFindUniqueArgs>(args: SelectSubset<T, RiskFindUniqueArgs<ExtArgs>>): Prisma__RiskClient<$Result.GetResult<Prisma.$RiskPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Risk that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RiskFindUniqueOrThrowArgs} args - Arguments to find a Risk
     * @example
     * // Get one Risk
     * const risk = await prisma.risk.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RiskFindUniqueOrThrowArgs>(args: SelectSubset<T, RiskFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RiskClient<$Result.GetResult<Prisma.$RiskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Risk that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskFindFirstArgs} args - Arguments to find a Risk
     * @example
     * // Get one Risk
     * const risk = await prisma.risk.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RiskFindFirstArgs>(args?: SelectSubset<T, RiskFindFirstArgs<ExtArgs>>): Prisma__RiskClient<$Result.GetResult<Prisma.$RiskPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Risk that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskFindFirstOrThrowArgs} args - Arguments to find a Risk
     * @example
     * // Get one Risk
     * const risk = await prisma.risk.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RiskFindFirstOrThrowArgs>(args?: SelectSubset<T, RiskFindFirstOrThrowArgs<ExtArgs>>): Prisma__RiskClient<$Result.GetResult<Prisma.$RiskPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Risks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Risks
     * const risks = await prisma.risk.findMany()
     * 
     * // Get first 10 Risks
     * const risks = await prisma.risk.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const riskWithIdOnly = await prisma.risk.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RiskFindManyArgs>(args?: SelectSubset<T, RiskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RiskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Risk.
     * @param {RiskCreateArgs} args - Arguments to create a Risk.
     * @example
     * // Create one Risk
     * const Risk = await prisma.risk.create({
     *   data: {
     *     // ... data to create a Risk
     *   }
     * })
     * 
     */
    create<T extends RiskCreateArgs>(args: SelectSubset<T, RiskCreateArgs<ExtArgs>>): Prisma__RiskClient<$Result.GetResult<Prisma.$RiskPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Risks.
     * @param {RiskCreateManyArgs} args - Arguments to create many Risks.
     * @example
     * // Create many Risks
     * const risk = await prisma.risk.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RiskCreateManyArgs>(args?: SelectSubset<T, RiskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Risks and returns the data saved in the database.
     * @param {RiskCreateManyAndReturnArgs} args - Arguments to create many Risks.
     * @example
     * // Create many Risks
     * const risk = await prisma.risk.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Risks and only return the `id`
     * const riskWithIdOnly = await prisma.risk.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RiskCreateManyAndReturnArgs>(args?: SelectSubset<T, RiskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RiskPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Risk.
     * @param {RiskDeleteArgs} args - Arguments to delete one Risk.
     * @example
     * // Delete one Risk
     * const Risk = await prisma.risk.delete({
     *   where: {
     *     // ... filter to delete one Risk
     *   }
     * })
     * 
     */
    delete<T extends RiskDeleteArgs>(args: SelectSubset<T, RiskDeleteArgs<ExtArgs>>): Prisma__RiskClient<$Result.GetResult<Prisma.$RiskPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Risk.
     * @param {RiskUpdateArgs} args - Arguments to update one Risk.
     * @example
     * // Update one Risk
     * const risk = await prisma.risk.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RiskUpdateArgs>(args: SelectSubset<T, RiskUpdateArgs<ExtArgs>>): Prisma__RiskClient<$Result.GetResult<Prisma.$RiskPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Risks.
     * @param {RiskDeleteManyArgs} args - Arguments to filter Risks to delete.
     * @example
     * // Delete a few Risks
     * const { count } = await prisma.risk.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RiskDeleteManyArgs>(args?: SelectSubset<T, RiskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Risks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Risks
     * const risk = await prisma.risk.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RiskUpdateManyArgs>(args: SelectSubset<T, RiskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Risks and returns the data updated in the database.
     * @param {RiskUpdateManyAndReturnArgs} args - Arguments to update many Risks.
     * @example
     * // Update many Risks
     * const risk = await prisma.risk.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Risks and only return the `id`
     * const riskWithIdOnly = await prisma.risk.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RiskUpdateManyAndReturnArgs>(args: SelectSubset<T, RiskUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RiskPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Risk.
     * @param {RiskUpsertArgs} args - Arguments to update or create a Risk.
     * @example
     * // Update or create a Risk
     * const risk = await prisma.risk.upsert({
     *   create: {
     *     // ... data to create a Risk
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Risk we want to update
     *   }
     * })
     */
    upsert<T extends RiskUpsertArgs>(args: SelectSubset<T, RiskUpsertArgs<ExtArgs>>): Prisma__RiskClient<$Result.GetResult<Prisma.$RiskPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Risks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskCountArgs} args - Arguments to filter Risks to count.
     * @example
     * // Count the number of Risks
     * const count = await prisma.risk.count({
     *   where: {
     *     // ... the filter for the Risks we want to count
     *   }
     * })
    **/
    count<T extends RiskCountArgs>(
      args?: Subset<T, RiskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RiskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Risk.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RiskAggregateArgs>(args: Subset<T, RiskAggregateArgs>): Prisma.PrismaPromise<GetRiskAggregateType<T>>

    /**
     * Group by Risk.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RiskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RiskGroupByArgs['orderBy'] }
        : { orderBy?: RiskGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RiskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRiskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Risk model
   */
  readonly fields: RiskFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Risk.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RiskClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Risk model
   */
  interface RiskFieldRefs {
    readonly id: FieldRef<"Risk", 'String'>
    readonly projectId: FieldRef<"Risk", 'String'>
    readonly requirementId: FieldRef<"Risk", 'String'>
    readonly severity: FieldRef<"Risk", 'Int'>
    readonly likelihood: FieldRef<"Risk", 'Int'>
    readonly detectability: FieldRef<"Risk", 'Int'>
    readonly riskScore: FieldRef<"Risk", 'Int'>
    readonly riskLevel: FieldRef<"Risk", 'String'>
    readonly mitigation: FieldRef<"Risk", 'String'>
    readonly residualRisk: FieldRef<"Risk", 'Int'>
    readonly classifiedBy: FieldRef<"Risk", 'String'>
    readonly createdAt: FieldRef<"Risk", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Risk findUnique
   */
  export type RiskFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Risk
     */
    select?: RiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Risk
     */
    omit?: RiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiskInclude<ExtArgs> | null
    /**
     * Filter, which Risk to fetch.
     */
    where: RiskWhereUniqueInput
  }

  /**
   * Risk findUniqueOrThrow
   */
  export type RiskFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Risk
     */
    select?: RiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Risk
     */
    omit?: RiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiskInclude<ExtArgs> | null
    /**
     * Filter, which Risk to fetch.
     */
    where: RiskWhereUniqueInput
  }

  /**
   * Risk findFirst
   */
  export type RiskFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Risk
     */
    select?: RiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Risk
     */
    omit?: RiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiskInclude<ExtArgs> | null
    /**
     * Filter, which Risk to fetch.
     */
    where?: RiskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Risks to fetch.
     */
    orderBy?: RiskOrderByWithRelationInput | RiskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Risks.
     */
    cursor?: RiskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Risks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Risks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Risks.
     */
    distinct?: RiskScalarFieldEnum | RiskScalarFieldEnum[]
  }

  /**
   * Risk findFirstOrThrow
   */
  export type RiskFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Risk
     */
    select?: RiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Risk
     */
    omit?: RiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiskInclude<ExtArgs> | null
    /**
     * Filter, which Risk to fetch.
     */
    where?: RiskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Risks to fetch.
     */
    orderBy?: RiskOrderByWithRelationInput | RiskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Risks.
     */
    cursor?: RiskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Risks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Risks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Risks.
     */
    distinct?: RiskScalarFieldEnum | RiskScalarFieldEnum[]
  }

  /**
   * Risk findMany
   */
  export type RiskFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Risk
     */
    select?: RiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Risk
     */
    omit?: RiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiskInclude<ExtArgs> | null
    /**
     * Filter, which Risks to fetch.
     */
    where?: RiskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Risks to fetch.
     */
    orderBy?: RiskOrderByWithRelationInput | RiskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Risks.
     */
    cursor?: RiskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Risks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Risks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Risks.
     */
    distinct?: RiskScalarFieldEnum | RiskScalarFieldEnum[]
  }

  /**
   * Risk create
   */
  export type RiskCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Risk
     */
    select?: RiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Risk
     */
    omit?: RiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiskInclude<ExtArgs> | null
    /**
     * The data needed to create a Risk.
     */
    data: XOR<RiskCreateInput, RiskUncheckedCreateInput>
  }

  /**
   * Risk createMany
   */
  export type RiskCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Risks.
     */
    data: RiskCreateManyInput | RiskCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Risk createManyAndReturn
   */
  export type RiskCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Risk
     */
    select?: RiskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Risk
     */
    omit?: RiskOmit<ExtArgs> | null
    /**
     * The data used to create many Risks.
     */
    data: RiskCreateManyInput | RiskCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiskIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Risk update
   */
  export type RiskUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Risk
     */
    select?: RiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Risk
     */
    omit?: RiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiskInclude<ExtArgs> | null
    /**
     * The data needed to update a Risk.
     */
    data: XOR<RiskUpdateInput, RiskUncheckedUpdateInput>
    /**
     * Choose, which Risk to update.
     */
    where: RiskWhereUniqueInput
  }

  /**
   * Risk updateMany
   */
  export type RiskUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Risks.
     */
    data: XOR<RiskUpdateManyMutationInput, RiskUncheckedUpdateManyInput>
    /**
     * Filter which Risks to update
     */
    where?: RiskWhereInput
    /**
     * Limit how many Risks to update.
     */
    limit?: number
  }

  /**
   * Risk updateManyAndReturn
   */
  export type RiskUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Risk
     */
    select?: RiskSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Risk
     */
    omit?: RiskOmit<ExtArgs> | null
    /**
     * The data used to update Risks.
     */
    data: XOR<RiskUpdateManyMutationInput, RiskUncheckedUpdateManyInput>
    /**
     * Filter which Risks to update
     */
    where?: RiskWhereInput
    /**
     * Limit how many Risks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiskIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Risk upsert
   */
  export type RiskUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Risk
     */
    select?: RiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Risk
     */
    omit?: RiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiskInclude<ExtArgs> | null
    /**
     * The filter to search for the Risk to update in case it exists.
     */
    where: RiskWhereUniqueInput
    /**
     * In case the Risk found by the `where` argument doesn't exist, create a new Risk with this data.
     */
    create: XOR<RiskCreateInput, RiskUncheckedCreateInput>
    /**
     * In case the Risk was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RiskUpdateInput, RiskUncheckedUpdateInput>
  }

  /**
   * Risk delete
   */
  export type RiskDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Risk
     */
    select?: RiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Risk
     */
    omit?: RiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiskInclude<ExtArgs> | null
    /**
     * Filter which Risk to delete.
     */
    where: RiskWhereUniqueInput
  }

  /**
   * Risk deleteMany
   */
  export type RiskDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Risks to delete
     */
    where?: RiskWhereInput
    /**
     * Limit how many Risks to delete.
     */
    limit?: number
  }

  /**
   * Risk without action
   */
  export type RiskDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Risk
     */
    select?: RiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Risk
     */
    omit?: RiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiskInclude<ExtArgs> | null
  }


  /**
   * Model CAPA
   */

  export type AggregateCAPA = {
    _count: CAPACountAggregateOutputType | null
    _min: CAPAMinAggregateOutputType | null
    _max: CAPAMaxAggregateOutputType | null
  }

  export type CAPAMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    title: string | null
    status: string | null
    rootCause: string | null
    containment: string | null
    correctiveAction: string | null
    preventiveAction: string | null
    effectivenessCheck: string | null
    linkedTestId: string | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CAPAMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    title: string | null
    status: string | null
    rootCause: string | null
    containment: string | null
    correctiveAction: string | null
    preventiveAction: string | null
    effectivenessCheck: string | null
    linkedTestId: string | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CAPACountAggregateOutputType = {
    id: number
    projectId: number
    title: number
    status: number
    rootCause: number
    containment: number
    correctiveAction: number
    preventiveAction: number
    effectivenessCheck: number
    linkedTestId: number
    createdBy: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CAPAMinAggregateInputType = {
    id?: true
    projectId?: true
    title?: true
    status?: true
    rootCause?: true
    containment?: true
    correctiveAction?: true
    preventiveAction?: true
    effectivenessCheck?: true
    linkedTestId?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CAPAMaxAggregateInputType = {
    id?: true
    projectId?: true
    title?: true
    status?: true
    rootCause?: true
    containment?: true
    correctiveAction?: true
    preventiveAction?: true
    effectivenessCheck?: true
    linkedTestId?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CAPACountAggregateInputType = {
    id?: true
    projectId?: true
    title?: true
    status?: true
    rootCause?: true
    containment?: true
    correctiveAction?: true
    preventiveAction?: true
    effectivenessCheck?: true
    linkedTestId?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CAPAAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CAPA to aggregate.
     */
    where?: CAPAWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CAPAS to fetch.
     */
    orderBy?: CAPAOrderByWithRelationInput | CAPAOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CAPAWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CAPAS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CAPAS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CAPAS
    **/
    _count?: true | CAPACountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CAPAMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CAPAMaxAggregateInputType
  }

  export type GetCAPAAggregateType<T extends CAPAAggregateArgs> = {
        [P in keyof T & keyof AggregateCAPA]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCAPA[P]>
      : GetScalarType<T[P], AggregateCAPA[P]>
  }




  export type CAPAGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CAPAWhereInput
    orderBy?: CAPAOrderByWithAggregationInput | CAPAOrderByWithAggregationInput[]
    by: CAPAScalarFieldEnum[] | CAPAScalarFieldEnum
    having?: CAPAScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CAPACountAggregateInputType | true
    _min?: CAPAMinAggregateInputType
    _max?: CAPAMaxAggregateInputType
  }

  export type CAPAGroupByOutputType = {
    id: string
    projectId: string
    title: string
    status: string
    rootCause: string | null
    containment: string | null
    correctiveAction: string | null
    preventiveAction: string | null
    effectivenessCheck: string | null
    linkedTestId: string | null
    createdBy: string | null
    createdAt: Date
    updatedAt: Date
    _count: CAPACountAggregateOutputType | null
    _min: CAPAMinAggregateOutputType | null
    _max: CAPAMaxAggregateOutputType | null
  }

  type GetCAPAGroupByPayload<T extends CAPAGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CAPAGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CAPAGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CAPAGroupByOutputType[P]>
            : GetScalarType<T[P], CAPAGroupByOutputType[P]>
        }
      >
    >


  export type CAPASelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    title?: boolean
    status?: boolean
    rootCause?: boolean
    containment?: boolean
    correctiveAction?: boolean
    preventiveAction?: boolean
    effectivenessCheck?: boolean
    linkedTestId?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cAPA"]>

  export type CAPASelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    title?: boolean
    status?: boolean
    rootCause?: boolean
    containment?: boolean
    correctiveAction?: boolean
    preventiveAction?: boolean
    effectivenessCheck?: boolean
    linkedTestId?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cAPA"]>

  export type CAPASelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    title?: boolean
    status?: boolean
    rootCause?: boolean
    containment?: boolean
    correctiveAction?: boolean
    preventiveAction?: boolean
    effectivenessCheck?: boolean
    linkedTestId?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cAPA"]>

  export type CAPASelectScalar = {
    id?: boolean
    projectId?: boolean
    title?: boolean
    status?: boolean
    rootCause?: boolean
    containment?: boolean
    correctiveAction?: boolean
    preventiveAction?: boolean
    effectivenessCheck?: boolean
    linkedTestId?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CAPAOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "title" | "status" | "rootCause" | "containment" | "correctiveAction" | "preventiveAction" | "effectivenessCheck" | "linkedTestId" | "createdBy" | "createdAt" | "updatedAt", ExtArgs["result"]["cAPA"]>
  export type CAPAInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type CAPAIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type CAPAIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $CAPAPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CAPA"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      title: string
      status: string
      rootCause: string | null
      containment: string | null
      correctiveAction: string | null
      preventiveAction: string | null
      effectivenessCheck: string | null
      linkedTestId: string | null
      createdBy: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cAPA"]>
    composites: {}
  }

  type CAPAGetPayload<S extends boolean | null | undefined | CAPADefaultArgs> = $Result.GetResult<Prisma.$CAPAPayload, S>

  type CAPACountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CAPAFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CAPACountAggregateInputType | true
    }

  export interface CAPADelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CAPA'], meta: { name: 'CAPA' } }
    /**
     * Find zero or one CAPA that matches the filter.
     * @param {CAPAFindUniqueArgs} args - Arguments to find a CAPA
     * @example
     * // Get one CAPA
     * const cAPA = await prisma.cAPA.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CAPAFindUniqueArgs>(args: SelectSubset<T, CAPAFindUniqueArgs<ExtArgs>>): Prisma__CAPAClient<$Result.GetResult<Prisma.$CAPAPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CAPA that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CAPAFindUniqueOrThrowArgs} args - Arguments to find a CAPA
     * @example
     * // Get one CAPA
     * const cAPA = await prisma.cAPA.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CAPAFindUniqueOrThrowArgs>(args: SelectSubset<T, CAPAFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CAPAClient<$Result.GetResult<Prisma.$CAPAPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CAPA that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CAPAFindFirstArgs} args - Arguments to find a CAPA
     * @example
     * // Get one CAPA
     * const cAPA = await prisma.cAPA.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CAPAFindFirstArgs>(args?: SelectSubset<T, CAPAFindFirstArgs<ExtArgs>>): Prisma__CAPAClient<$Result.GetResult<Prisma.$CAPAPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CAPA that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CAPAFindFirstOrThrowArgs} args - Arguments to find a CAPA
     * @example
     * // Get one CAPA
     * const cAPA = await prisma.cAPA.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CAPAFindFirstOrThrowArgs>(args?: SelectSubset<T, CAPAFindFirstOrThrowArgs<ExtArgs>>): Prisma__CAPAClient<$Result.GetResult<Prisma.$CAPAPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CAPAS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CAPAFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CAPAS
     * const cAPAS = await prisma.cAPA.findMany()
     * 
     * // Get first 10 CAPAS
     * const cAPAS = await prisma.cAPA.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cAPAWithIdOnly = await prisma.cAPA.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CAPAFindManyArgs>(args?: SelectSubset<T, CAPAFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CAPAPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CAPA.
     * @param {CAPACreateArgs} args - Arguments to create a CAPA.
     * @example
     * // Create one CAPA
     * const CAPA = await prisma.cAPA.create({
     *   data: {
     *     // ... data to create a CAPA
     *   }
     * })
     * 
     */
    create<T extends CAPACreateArgs>(args: SelectSubset<T, CAPACreateArgs<ExtArgs>>): Prisma__CAPAClient<$Result.GetResult<Prisma.$CAPAPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CAPAS.
     * @param {CAPACreateManyArgs} args - Arguments to create many CAPAS.
     * @example
     * // Create many CAPAS
     * const cAPA = await prisma.cAPA.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CAPACreateManyArgs>(args?: SelectSubset<T, CAPACreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CAPAS and returns the data saved in the database.
     * @param {CAPACreateManyAndReturnArgs} args - Arguments to create many CAPAS.
     * @example
     * // Create many CAPAS
     * const cAPA = await prisma.cAPA.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CAPAS and only return the `id`
     * const cAPAWithIdOnly = await prisma.cAPA.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CAPACreateManyAndReturnArgs>(args?: SelectSubset<T, CAPACreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CAPAPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CAPA.
     * @param {CAPADeleteArgs} args - Arguments to delete one CAPA.
     * @example
     * // Delete one CAPA
     * const CAPA = await prisma.cAPA.delete({
     *   where: {
     *     // ... filter to delete one CAPA
     *   }
     * })
     * 
     */
    delete<T extends CAPADeleteArgs>(args: SelectSubset<T, CAPADeleteArgs<ExtArgs>>): Prisma__CAPAClient<$Result.GetResult<Prisma.$CAPAPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CAPA.
     * @param {CAPAUpdateArgs} args - Arguments to update one CAPA.
     * @example
     * // Update one CAPA
     * const cAPA = await prisma.cAPA.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CAPAUpdateArgs>(args: SelectSubset<T, CAPAUpdateArgs<ExtArgs>>): Prisma__CAPAClient<$Result.GetResult<Prisma.$CAPAPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CAPAS.
     * @param {CAPADeleteManyArgs} args - Arguments to filter CAPAS to delete.
     * @example
     * // Delete a few CAPAS
     * const { count } = await prisma.cAPA.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CAPADeleteManyArgs>(args?: SelectSubset<T, CAPADeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CAPAS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CAPAUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CAPAS
     * const cAPA = await prisma.cAPA.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CAPAUpdateManyArgs>(args: SelectSubset<T, CAPAUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CAPAS and returns the data updated in the database.
     * @param {CAPAUpdateManyAndReturnArgs} args - Arguments to update many CAPAS.
     * @example
     * // Update many CAPAS
     * const cAPA = await prisma.cAPA.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CAPAS and only return the `id`
     * const cAPAWithIdOnly = await prisma.cAPA.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CAPAUpdateManyAndReturnArgs>(args: SelectSubset<T, CAPAUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CAPAPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CAPA.
     * @param {CAPAUpsertArgs} args - Arguments to update or create a CAPA.
     * @example
     * // Update or create a CAPA
     * const cAPA = await prisma.cAPA.upsert({
     *   create: {
     *     // ... data to create a CAPA
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CAPA we want to update
     *   }
     * })
     */
    upsert<T extends CAPAUpsertArgs>(args: SelectSubset<T, CAPAUpsertArgs<ExtArgs>>): Prisma__CAPAClient<$Result.GetResult<Prisma.$CAPAPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CAPAS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CAPACountArgs} args - Arguments to filter CAPAS to count.
     * @example
     * // Count the number of CAPAS
     * const count = await prisma.cAPA.count({
     *   where: {
     *     // ... the filter for the CAPAS we want to count
     *   }
     * })
    **/
    count<T extends CAPACountArgs>(
      args?: Subset<T, CAPACountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CAPACountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CAPA.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CAPAAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CAPAAggregateArgs>(args: Subset<T, CAPAAggregateArgs>): Prisma.PrismaPromise<GetCAPAAggregateType<T>>

    /**
     * Group by CAPA.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CAPAGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CAPAGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CAPAGroupByArgs['orderBy'] }
        : { orderBy?: CAPAGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CAPAGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCAPAGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CAPA model
   */
  readonly fields: CAPAFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CAPA.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CAPAClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CAPA model
   */
  interface CAPAFieldRefs {
    readonly id: FieldRef<"CAPA", 'String'>
    readonly projectId: FieldRef<"CAPA", 'String'>
    readonly title: FieldRef<"CAPA", 'String'>
    readonly status: FieldRef<"CAPA", 'String'>
    readonly rootCause: FieldRef<"CAPA", 'String'>
    readonly containment: FieldRef<"CAPA", 'String'>
    readonly correctiveAction: FieldRef<"CAPA", 'String'>
    readonly preventiveAction: FieldRef<"CAPA", 'String'>
    readonly effectivenessCheck: FieldRef<"CAPA", 'String'>
    readonly linkedTestId: FieldRef<"CAPA", 'String'>
    readonly createdBy: FieldRef<"CAPA", 'String'>
    readonly createdAt: FieldRef<"CAPA", 'DateTime'>
    readonly updatedAt: FieldRef<"CAPA", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CAPA findUnique
   */
  export type CAPAFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CAPA
     */
    select?: CAPASelect<ExtArgs> | null
    /**
     * Omit specific fields from the CAPA
     */
    omit?: CAPAOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CAPAInclude<ExtArgs> | null
    /**
     * Filter, which CAPA to fetch.
     */
    where: CAPAWhereUniqueInput
  }

  /**
   * CAPA findUniqueOrThrow
   */
  export type CAPAFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CAPA
     */
    select?: CAPASelect<ExtArgs> | null
    /**
     * Omit specific fields from the CAPA
     */
    omit?: CAPAOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CAPAInclude<ExtArgs> | null
    /**
     * Filter, which CAPA to fetch.
     */
    where: CAPAWhereUniqueInput
  }

  /**
   * CAPA findFirst
   */
  export type CAPAFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CAPA
     */
    select?: CAPASelect<ExtArgs> | null
    /**
     * Omit specific fields from the CAPA
     */
    omit?: CAPAOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CAPAInclude<ExtArgs> | null
    /**
     * Filter, which CAPA to fetch.
     */
    where?: CAPAWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CAPAS to fetch.
     */
    orderBy?: CAPAOrderByWithRelationInput | CAPAOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CAPAS.
     */
    cursor?: CAPAWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CAPAS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CAPAS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CAPAS.
     */
    distinct?: CAPAScalarFieldEnum | CAPAScalarFieldEnum[]
  }

  /**
   * CAPA findFirstOrThrow
   */
  export type CAPAFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CAPA
     */
    select?: CAPASelect<ExtArgs> | null
    /**
     * Omit specific fields from the CAPA
     */
    omit?: CAPAOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CAPAInclude<ExtArgs> | null
    /**
     * Filter, which CAPA to fetch.
     */
    where?: CAPAWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CAPAS to fetch.
     */
    orderBy?: CAPAOrderByWithRelationInput | CAPAOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CAPAS.
     */
    cursor?: CAPAWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CAPAS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CAPAS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CAPAS.
     */
    distinct?: CAPAScalarFieldEnum | CAPAScalarFieldEnum[]
  }

  /**
   * CAPA findMany
   */
  export type CAPAFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CAPA
     */
    select?: CAPASelect<ExtArgs> | null
    /**
     * Omit specific fields from the CAPA
     */
    omit?: CAPAOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CAPAInclude<ExtArgs> | null
    /**
     * Filter, which CAPAS to fetch.
     */
    where?: CAPAWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CAPAS to fetch.
     */
    orderBy?: CAPAOrderByWithRelationInput | CAPAOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CAPAS.
     */
    cursor?: CAPAWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CAPAS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CAPAS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CAPAS.
     */
    distinct?: CAPAScalarFieldEnum | CAPAScalarFieldEnum[]
  }

  /**
   * CAPA create
   */
  export type CAPACreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CAPA
     */
    select?: CAPASelect<ExtArgs> | null
    /**
     * Omit specific fields from the CAPA
     */
    omit?: CAPAOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CAPAInclude<ExtArgs> | null
    /**
     * The data needed to create a CAPA.
     */
    data: XOR<CAPACreateInput, CAPAUncheckedCreateInput>
  }

  /**
   * CAPA createMany
   */
  export type CAPACreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CAPAS.
     */
    data: CAPACreateManyInput | CAPACreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CAPA createManyAndReturn
   */
  export type CAPACreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CAPA
     */
    select?: CAPASelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CAPA
     */
    omit?: CAPAOmit<ExtArgs> | null
    /**
     * The data used to create many CAPAS.
     */
    data: CAPACreateManyInput | CAPACreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CAPAIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CAPA update
   */
  export type CAPAUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CAPA
     */
    select?: CAPASelect<ExtArgs> | null
    /**
     * Omit specific fields from the CAPA
     */
    omit?: CAPAOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CAPAInclude<ExtArgs> | null
    /**
     * The data needed to update a CAPA.
     */
    data: XOR<CAPAUpdateInput, CAPAUncheckedUpdateInput>
    /**
     * Choose, which CAPA to update.
     */
    where: CAPAWhereUniqueInput
  }

  /**
   * CAPA updateMany
   */
  export type CAPAUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CAPAS.
     */
    data: XOR<CAPAUpdateManyMutationInput, CAPAUncheckedUpdateManyInput>
    /**
     * Filter which CAPAS to update
     */
    where?: CAPAWhereInput
    /**
     * Limit how many CAPAS to update.
     */
    limit?: number
  }

  /**
   * CAPA updateManyAndReturn
   */
  export type CAPAUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CAPA
     */
    select?: CAPASelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CAPA
     */
    omit?: CAPAOmit<ExtArgs> | null
    /**
     * The data used to update CAPAS.
     */
    data: XOR<CAPAUpdateManyMutationInput, CAPAUncheckedUpdateManyInput>
    /**
     * Filter which CAPAS to update
     */
    where?: CAPAWhereInput
    /**
     * Limit how many CAPAS to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CAPAIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CAPA upsert
   */
  export type CAPAUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CAPA
     */
    select?: CAPASelect<ExtArgs> | null
    /**
     * Omit specific fields from the CAPA
     */
    omit?: CAPAOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CAPAInclude<ExtArgs> | null
    /**
     * The filter to search for the CAPA to update in case it exists.
     */
    where: CAPAWhereUniqueInput
    /**
     * In case the CAPA found by the `where` argument doesn't exist, create a new CAPA with this data.
     */
    create: XOR<CAPACreateInput, CAPAUncheckedCreateInput>
    /**
     * In case the CAPA was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CAPAUpdateInput, CAPAUncheckedUpdateInput>
  }

  /**
   * CAPA delete
   */
  export type CAPADeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CAPA
     */
    select?: CAPASelect<ExtArgs> | null
    /**
     * Omit specific fields from the CAPA
     */
    omit?: CAPAOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CAPAInclude<ExtArgs> | null
    /**
     * Filter which CAPA to delete.
     */
    where: CAPAWhereUniqueInput
  }

  /**
   * CAPA deleteMany
   */
  export type CAPADeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CAPAS to delete
     */
    where?: CAPAWhereInput
    /**
     * Limit how many CAPAS to delete.
     */
    limit?: number
  }

  /**
   * CAPA without action
   */
  export type CAPADefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CAPA
     */
    select?: CAPASelect<ExtArgs> | null
    /**
     * Omit specific fields from the CAPA
     */
    omit?: CAPAOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CAPAInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    timestamp: Date | null
    userId: string | null
    action: string | null
    entityType: string | null
    entityId: string | null
    reason: string | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    timestamp: Date | null
    userId: string | null
    action: string | null
    entityType: string | null
    entityId: string | null
    reason: string | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    projectId: number
    timestamp: number
    userId: number
    action: number
    entityType: number
    entityId: number
    previousValue: number
    newValue: number
    reason: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    projectId?: true
    timestamp?: true
    userId?: true
    action?: true
    entityType?: true
    entityId?: true
    reason?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    projectId?: true
    timestamp?: true
    userId?: true
    action?: true
    entityType?: true
    entityId?: true
    reason?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    projectId?: true
    timestamp?: true
    userId?: true
    action?: true
    entityType?: true
    entityId?: true
    previousValue?: true
    newValue?: true
    reason?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    projectId: string
    timestamp: Date
    userId: string
    action: string
    entityType: string
    entityId: string
    previousValue: JsonValue | null
    newValue: JsonValue | null
    reason: string | null
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    timestamp?: boolean
    userId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    previousValue?: boolean
    newValue?: boolean
    reason?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    timestamp?: boolean
    userId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    previousValue?: boolean
    newValue?: boolean
    reason?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    timestamp?: boolean
    userId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    previousValue?: boolean
    newValue?: boolean
    reason?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    projectId?: boolean
    timestamp?: boolean
    userId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    previousValue?: boolean
    newValue?: boolean
    reason?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "timestamp" | "userId" | "action" | "entityType" | "entityId" | "previousValue" | "newValue" | "reason", ExtArgs["result"]["auditLog"]>
  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type AuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type AuditLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      timestamp: Date
      userId: string
      action: string
      entityType: string
      entityId: string
      previousValue: Prisma.JsonValue | null
      newValue: Prisma.JsonValue | null
      reason: string | null
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly projectId: FieldRef<"AuditLog", 'String'>
    readonly timestamp: FieldRef<"AuditLog", 'DateTime'>
    readonly userId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly entityType: FieldRef<"AuditLog", 'String'>
    readonly entityId: FieldRef<"AuditLog", 'String'>
    readonly previousValue: FieldRef<"AuditLog", 'Json'>
    readonly newValue: FieldRef<"AuditLog", 'Json'>
    readonly reason: FieldRef<"AuditLog", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    name: 'name',
    role: 'role',
    orgId: 'orgId',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const OrganizationScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt'
  };

  export type OrganizationScalarFieldEnum = (typeof OrganizationScalarFieldEnum)[keyof typeof OrganizationScalarFieldEnum]


  export const WorkspaceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    orgId: 'orgId',
    createdAt: 'createdAt'
  };

  export type WorkspaceScalarFieldEnum = (typeof WorkspaceScalarFieldEnum)[keyof typeof WorkspaceScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    workspaceId: 'workspaceId',
    name: 'name',
    description: 'description',
    owner: 'owner',
    version: 'version',
    country: 'country',
    vertical: 'vertical',
    modules: 'modules',
    type: 'type',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const RequirementScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    seqId: 'seqId',
    title: 'title',
    description: 'description',
    status: 'status',
    tags: 'tags',
    riskLevel: 'riskLevel',
    regulatoryRef: 'regulatoryRef',
    evidenceHints: 'evidenceHints',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RequirementScalarFieldEnum = (typeof RequirementScalarFieldEnum)[keyof typeof RequirementScalarFieldEnum]


  export const TestScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    seqId: 'seqId',
    title: 'title',
    description: 'description',
    status: 'status',
    linkedRequirementIds: 'linkedRequirementIds',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TestScalarFieldEnum = (typeof TestScalarFieldEnum)[keyof typeof TestScalarFieldEnum]


  export const RiskScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    requirementId: 'requirementId',
    severity: 'severity',
    likelihood: 'likelihood',
    detectability: 'detectability',
    riskScore: 'riskScore',
    riskLevel: 'riskLevel',
    mitigation: 'mitigation',
    residualRisk: 'residualRisk',
    classifiedBy: 'classifiedBy',
    createdAt: 'createdAt'
  };

  export type RiskScalarFieldEnum = (typeof RiskScalarFieldEnum)[keyof typeof RiskScalarFieldEnum]


  export const CAPAScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    title: 'title',
    status: 'status',
    rootCause: 'rootCause',
    containment: 'containment',
    correctiveAction: 'correctiveAction',
    preventiveAction: 'preventiveAction',
    effectivenessCheck: 'effectivenessCheck',
    linkedTestId: 'linkedTestId',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CAPAScalarFieldEnum = (typeof CAPAScalarFieldEnum)[keyof typeof CAPAScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    timestamp: 'timestamp',
    userId: 'userId',
    action: 'action',
    entityType: 'entityType',
    entityId: 'entityId',
    previousValue: 'previousValue',
    newValue: 'newValue',
    reason: 'reason'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    orgId?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    org?: XOR<OrganizationNullableScalarRelationFilter, OrganizationWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    orgId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    org?: OrganizationOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    orgId?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    org?: XOR<OrganizationNullableScalarRelationFilter, OrganizationWhereInput> | null
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    orgId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    orgId?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type OrganizationWhereInput = {
    AND?: OrganizationWhereInput | OrganizationWhereInput[]
    OR?: OrganizationWhereInput[]
    NOT?: OrganizationWhereInput | OrganizationWhereInput[]
    id?: StringFilter<"Organization"> | string
    name?: StringFilter<"Organization"> | string
    createdAt?: DateTimeFilter<"Organization"> | Date | string
    users?: UserListRelationFilter
    workspaces?: WorkspaceListRelationFilter
  }

  export type OrganizationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    users?: UserOrderByRelationAggregateInput
    workspaces?: WorkspaceOrderByRelationAggregateInput
  }

  export type OrganizationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OrganizationWhereInput | OrganizationWhereInput[]
    OR?: OrganizationWhereInput[]
    NOT?: OrganizationWhereInput | OrganizationWhereInput[]
    name?: StringFilter<"Organization"> | string
    createdAt?: DateTimeFilter<"Organization"> | Date | string
    users?: UserListRelationFilter
    workspaces?: WorkspaceListRelationFilter
  }, "id">

  export type OrganizationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    _count?: OrganizationCountOrderByAggregateInput
    _max?: OrganizationMaxOrderByAggregateInput
    _min?: OrganizationMinOrderByAggregateInput
  }

  export type OrganizationScalarWhereWithAggregatesInput = {
    AND?: OrganizationScalarWhereWithAggregatesInput | OrganizationScalarWhereWithAggregatesInput[]
    OR?: OrganizationScalarWhereWithAggregatesInput[]
    NOT?: OrganizationScalarWhereWithAggregatesInput | OrganizationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Organization"> | string
    name?: StringWithAggregatesFilter<"Organization"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Organization"> | Date | string
  }

  export type WorkspaceWhereInput = {
    AND?: WorkspaceWhereInput | WorkspaceWhereInput[]
    OR?: WorkspaceWhereInput[]
    NOT?: WorkspaceWhereInput | WorkspaceWhereInput[]
    id?: StringFilter<"Workspace"> | string
    name?: StringFilter<"Workspace"> | string
    orgId?: StringFilter<"Workspace"> | string
    createdAt?: DateTimeFilter<"Workspace"> | Date | string
    org?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    projects?: ProjectListRelationFilter
  }

  export type WorkspaceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    orgId?: SortOrder
    createdAt?: SortOrder
    org?: OrganizationOrderByWithRelationInput
    projects?: ProjectOrderByRelationAggregateInput
  }

  export type WorkspaceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WorkspaceWhereInput | WorkspaceWhereInput[]
    OR?: WorkspaceWhereInput[]
    NOT?: WorkspaceWhereInput | WorkspaceWhereInput[]
    name?: StringFilter<"Workspace"> | string
    orgId?: StringFilter<"Workspace"> | string
    createdAt?: DateTimeFilter<"Workspace"> | Date | string
    org?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    projects?: ProjectListRelationFilter
  }, "id">

  export type WorkspaceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    orgId?: SortOrder
    createdAt?: SortOrder
    _count?: WorkspaceCountOrderByAggregateInput
    _max?: WorkspaceMaxOrderByAggregateInput
    _min?: WorkspaceMinOrderByAggregateInput
  }

  export type WorkspaceScalarWhereWithAggregatesInput = {
    AND?: WorkspaceScalarWhereWithAggregatesInput | WorkspaceScalarWhereWithAggregatesInput[]
    OR?: WorkspaceScalarWhereWithAggregatesInput[]
    NOT?: WorkspaceScalarWhereWithAggregatesInput | WorkspaceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Workspace"> | string
    name?: StringWithAggregatesFilter<"Workspace"> | string
    orgId?: StringWithAggregatesFilter<"Workspace"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Workspace"> | Date | string
  }

  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    workspaceId?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    description?: StringFilter<"Project"> | string
    owner?: StringFilter<"Project"> | string
    version?: StringFilter<"Project"> | string
    country?: StringFilter<"Project"> | string
    vertical?: StringNullableFilter<"Project"> | string | null
    modules?: StringNullableListFilter<"Project">
    type?: StringFilter<"Project"> | string
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
    requirements?: RequirementListRelationFilter
    tests?: TestListRelationFilter
    risks?: RiskListRelationFilter
    capas?: CAPAListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    workspaceId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    owner?: SortOrder
    version?: SortOrder
    country?: SortOrder
    vertical?: SortOrderInput | SortOrder
    modules?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    workspace?: WorkspaceOrderByWithRelationInput
    requirements?: RequirementOrderByRelationAggregateInput
    tests?: TestOrderByRelationAggregateInput
    risks?: RiskOrderByRelationAggregateInput
    capas?: CAPAOrderByRelationAggregateInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    workspaceId?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    description?: StringFilter<"Project"> | string
    owner?: StringFilter<"Project"> | string
    version?: StringFilter<"Project"> | string
    country?: StringFilter<"Project"> | string
    vertical?: StringNullableFilter<"Project"> | string | null
    modules?: StringNullableListFilter<"Project">
    type?: StringFilter<"Project"> | string
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
    requirements?: RequirementListRelationFilter
    tests?: TestListRelationFilter
    risks?: RiskListRelationFilter
    capas?: CAPAListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }, "id">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    workspaceId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    owner?: SortOrder
    version?: SortOrder
    country?: SortOrder
    vertical?: SortOrderInput | SortOrder
    modules?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    workspaceId?: StringWithAggregatesFilter<"Project"> | string
    name?: StringWithAggregatesFilter<"Project"> | string
    description?: StringWithAggregatesFilter<"Project"> | string
    owner?: StringWithAggregatesFilter<"Project"> | string
    version?: StringWithAggregatesFilter<"Project"> | string
    country?: StringWithAggregatesFilter<"Project"> | string
    vertical?: StringNullableWithAggregatesFilter<"Project"> | string | null
    modules?: StringNullableListFilter<"Project">
    type?: StringWithAggregatesFilter<"Project"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
  }

  export type RequirementWhereInput = {
    AND?: RequirementWhereInput | RequirementWhereInput[]
    OR?: RequirementWhereInput[]
    NOT?: RequirementWhereInput | RequirementWhereInput[]
    id?: StringFilter<"Requirement"> | string
    projectId?: StringFilter<"Requirement"> | string
    seqId?: StringFilter<"Requirement"> | string
    title?: StringFilter<"Requirement"> | string
    description?: StringFilter<"Requirement"> | string
    status?: StringFilter<"Requirement"> | string
    tags?: StringNullableListFilter<"Requirement">
    riskLevel?: StringNullableFilter<"Requirement"> | string | null
    regulatoryRef?: StringNullableFilter<"Requirement"> | string | null
    evidenceHints?: StringNullableListFilter<"Requirement">
    createdBy?: StringNullableFilter<"Requirement"> | string | null
    createdAt?: DateTimeFilter<"Requirement"> | Date | string
    updatedAt?: DateTimeFilter<"Requirement"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type RequirementOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    seqId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    tags?: SortOrder
    riskLevel?: SortOrderInput | SortOrder
    regulatoryRef?: SortOrderInput | SortOrder
    evidenceHints?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type RequirementWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RequirementWhereInput | RequirementWhereInput[]
    OR?: RequirementWhereInput[]
    NOT?: RequirementWhereInput | RequirementWhereInput[]
    projectId?: StringFilter<"Requirement"> | string
    seqId?: StringFilter<"Requirement"> | string
    title?: StringFilter<"Requirement"> | string
    description?: StringFilter<"Requirement"> | string
    status?: StringFilter<"Requirement"> | string
    tags?: StringNullableListFilter<"Requirement">
    riskLevel?: StringNullableFilter<"Requirement"> | string | null
    regulatoryRef?: StringNullableFilter<"Requirement"> | string | null
    evidenceHints?: StringNullableListFilter<"Requirement">
    createdBy?: StringNullableFilter<"Requirement"> | string | null
    createdAt?: DateTimeFilter<"Requirement"> | Date | string
    updatedAt?: DateTimeFilter<"Requirement"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }, "id">

  export type RequirementOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    seqId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    tags?: SortOrder
    riskLevel?: SortOrderInput | SortOrder
    regulatoryRef?: SortOrderInput | SortOrder
    evidenceHints?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RequirementCountOrderByAggregateInput
    _max?: RequirementMaxOrderByAggregateInput
    _min?: RequirementMinOrderByAggregateInput
  }

  export type RequirementScalarWhereWithAggregatesInput = {
    AND?: RequirementScalarWhereWithAggregatesInput | RequirementScalarWhereWithAggregatesInput[]
    OR?: RequirementScalarWhereWithAggregatesInput[]
    NOT?: RequirementScalarWhereWithAggregatesInput | RequirementScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Requirement"> | string
    projectId?: StringWithAggregatesFilter<"Requirement"> | string
    seqId?: StringWithAggregatesFilter<"Requirement"> | string
    title?: StringWithAggregatesFilter<"Requirement"> | string
    description?: StringWithAggregatesFilter<"Requirement"> | string
    status?: StringWithAggregatesFilter<"Requirement"> | string
    tags?: StringNullableListFilter<"Requirement">
    riskLevel?: StringNullableWithAggregatesFilter<"Requirement"> | string | null
    regulatoryRef?: StringNullableWithAggregatesFilter<"Requirement"> | string | null
    evidenceHints?: StringNullableListFilter<"Requirement">
    createdBy?: StringNullableWithAggregatesFilter<"Requirement"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Requirement"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Requirement"> | Date | string
  }

  export type TestWhereInput = {
    AND?: TestWhereInput | TestWhereInput[]
    OR?: TestWhereInput[]
    NOT?: TestWhereInput | TestWhereInput[]
    id?: StringFilter<"Test"> | string
    projectId?: StringFilter<"Test"> | string
    seqId?: StringFilter<"Test"> | string
    title?: StringFilter<"Test"> | string
    description?: StringFilter<"Test"> | string
    status?: StringFilter<"Test"> | string
    linkedRequirementIds?: StringNullableListFilter<"Test">
    createdBy?: StringNullableFilter<"Test"> | string | null
    createdAt?: DateTimeFilter<"Test"> | Date | string
    updatedAt?: DateTimeFilter<"Test"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type TestOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    seqId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    linkedRequirementIds?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type TestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TestWhereInput | TestWhereInput[]
    OR?: TestWhereInput[]
    NOT?: TestWhereInput | TestWhereInput[]
    projectId?: StringFilter<"Test"> | string
    seqId?: StringFilter<"Test"> | string
    title?: StringFilter<"Test"> | string
    description?: StringFilter<"Test"> | string
    status?: StringFilter<"Test"> | string
    linkedRequirementIds?: StringNullableListFilter<"Test">
    createdBy?: StringNullableFilter<"Test"> | string | null
    createdAt?: DateTimeFilter<"Test"> | Date | string
    updatedAt?: DateTimeFilter<"Test"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }, "id">

  export type TestOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    seqId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    linkedRequirementIds?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TestCountOrderByAggregateInput
    _max?: TestMaxOrderByAggregateInput
    _min?: TestMinOrderByAggregateInput
  }

  export type TestScalarWhereWithAggregatesInput = {
    AND?: TestScalarWhereWithAggregatesInput | TestScalarWhereWithAggregatesInput[]
    OR?: TestScalarWhereWithAggregatesInput[]
    NOT?: TestScalarWhereWithAggregatesInput | TestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Test"> | string
    projectId?: StringWithAggregatesFilter<"Test"> | string
    seqId?: StringWithAggregatesFilter<"Test"> | string
    title?: StringWithAggregatesFilter<"Test"> | string
    description?: StringWithAggregatesFilter<"Test"> | string
    status?: StringWithAggregatesFilter<"Test"> | string
    linkedRequirementIds?: StringNullableListFilter<"Test">
    createdBy?: StringNullableWithAggregatesFilter<"Test"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Test"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Test"> | Date | string
  }

  export type RiskWhereInput = {
    AND?: RiskWhereInput | RiskWhereInput[]
    OR?: RiskWhereInput[]
    NOT?: RiskWhereInput | RiskWhereInput[]
    id?: StringFilter<"Risk"> | string
    projectId?: StringFilter<"Risk"> | string
    requirementId?: StringFilter<"Risk"> | string
    severity?: IntFilter<"Risk"> | number
    likelihood?: IntFilter<"Risk"> | number
    detectability?: IntNullableFilter<"Risk"> | number | null
    riskScore?: IntFilter<"Risk"> | number
    riskLevel?: StringFilter<"Risk"> | string
    mitigation?: StringNullableFilter<"Risk"> | string | null
    residualRisk?: IntNullableFilter<"Risk"> | number | null
    classifiedBy?: StringFilter<"Risk"> | string
    createdAt?: DateTimeFilter<"Risk"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type RiskOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    requirementId?: SortOrder
    severity?: SortOrder
    likelihood?: SortOrder
    detectability?: SortOrderInput | SortOrder
    riskScore?: SortOrder
    riskLevel?: SortOrder
    mitigation?: SortOrderInput | SortOrder
    residualRisk?: SortOrderInput | SortOrder
    classifiedBy?: SortOrder
    createdAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type RiskWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RiskWhereInput | RiskWhereInput[]
    OR?: RiskWhereInput[]
    NOT?: RiskWhereInput | RiskWhereInput[]
    projectId?: StringFilter<"Risk"> | string
    requirementId?: StringFilter<"Risk"> | string
    severity?: IntFilter<"Risk"> | number
    likelihood?: IntFilter<"Risk"> | number
    detectability?: IntNullableFilter<"Risk"> | number | null
    riskScore?: IntFilter<"Risk"> | number
    riskLevel?: StringFilter<"Risk"> | string
    mitigation?: StringNullableFilter<"Risk"> | string | null
    residualRisk?: IntNullableFilter<"Risk"> | number | null
    classifiedBy?: StringFilter<"Risk"> | string
    createdAt?: DateTimeFilter<"Risk"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }, "id">

  export type RiskOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    requirementId?: SortOrder
    severity?: SortOrder
    likelihood?: SortOrder
    detectability?: SortOrderInput | SortOrder
    riskScore?: SortOrder
    riskLevel?: SortOrder
    mitigation?: SortOrderInput | SortOrder
    residualRisk?: SortOrderInput | SortOrder
    classifiedBy?: SortOrder
    createdAt?: SortOrder
    _count?: RiskCountOrderByAggregateInput
    _avg?: RiskAvgOrderByAggregateInput
    _max?: RiskMaxOrderByAggregateInput
    _min?: RiskMinOrderByAggregateInput
    _sum?: RiskSumOrderByAggregateInput
  }

  export type RiskScalarWhereWithAggregatesInput = {
    AND?: RiskScalarWhereWithAggregatesInput | RiskScalarWhereWithAggregatesInput[]
    OR?: RiskScalarWhereWithAggregatesInput[]
    NOT?: RiskScalarWhereWithAggregatesInput | RiskScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Risk"> | string
    projectId?: StringWithAggregatesFilter<"Risk"> | string
    requirementId?: StringWithAggregatesFilter<"Risk"> | string
    severity?: IntWithAggregatesFilter<"Risk"> | number
    likelihood?: IntWithAggregatesFilter<"Risk"> | number
    detectability?: IntNullableWithAggregatesFilter<"Risk"> | number | null
    riskScore?: IntWithAggregatesFilter<"Risk"> | number
    riskLevel?: StringWithAggregatesFilter<"Risk"> | string
    mitigation?: StringNullableWithAggregatesFilter<"Risk"> | string | null
    residualRisk?: IntNullableWithAggregatesFilter<"Risk"> | number | null
    classifiedBy?: StringWithAggregatesFilter<"Risk"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Risk"> | Date | string
  }

  export type CAPAWhereInput = {
    AND?: CAPAWhereInput | CAPAWhereInput[]
    OR?: CAPAWhereInput[]
    NOT?: CAPAWhereInput | CAPAWhereInput[]
    id?: StringFilter<"CAPA"> | string
    projectId?: StringFilter<"CAPA"> | string
    title?: StringFilter<"CAPA"> | string
    status?: StringFilter<"CAPA"> | string
    rootCause?: StringNullableFilter<"CAPA"> | string | null
    containment?: StringNullableFilter<"CAPA"> | string | null
    correctiveAction?: StringNullableFilter<"CAPA"> | string | null
    preventiveAction?: StringNullableFilter<"CAPA"> | string | null
    effectivenessCheck?: StringNullableFilter<"CAPA"> | string | null
    linkedTestId?: StringNullableFilter<"CAPA"> | string | null
    createdBy?: StringNullableFilter<"CAPA"> | string | null
    createdAt?: DateTimeFilter<"CAPA"> | Date | string
    updatedAt?: DateTimeFilter<"CAPA"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type CAPAOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    title?: SortOrder
    status?: SortOrder
    rootCause?: SortOrderInput | SortOrder
    containment?: SortOrderInput | SortOrder
    correctiveAction?: SortOrderInput | SortOrder
    preventiveAction?: SortOrderInput | SortOrder
    effectivenessCheck?: SortOrderInput | SortOrder
    linkedTestId?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type CAPAWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CAPAWhereInput | CAPAWhereInput[]
    OR?: CAPAWhereInput[]
    NOT?: CAPAWhereInput | CAPAWhereInput[]
    projectId?: StringFilter<"CAPA"> | string
    title?: StringFilter<"CAPA"> | string
    status?: StringFilter<"CAPA"> | string
    rootCause?: StringNullableFilter<"CAPA"> | string | null
    containment?: StringNullableFilter<"CAPA"> | string | null
    correctiveAction?: StringNullableFilter<"CAPA"> | string | null
    preventiveAction?: StringNullableFilter<"CAPA"> | string | null
    effectivenessCheck?: StringNullableFilter<"CAPA"> | string | null
    linkedTestId?: StringNullableFilter<"CAPA"> | string | null
    createdBy?: StringNullableFilter<"CAPA"> | string | null
    createdAt?: DateTimeFilter<"CAPA"> | Date | string
    updatedAt?: DateTimeFilter<"CAPA"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }, "id">

  export type CAPAOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    title?: SortOrder
    status?: SortOrder
    rootCause?: SortOrderInput | SortOrder
    containment?: SortOrderInput | SortOrder
    correctiveAction?: SortOrderInput | SortOrder
    preventiveAction?: SortOrderInput | SortOrder
    effectivenessCheck?: SortOrderInput | SortOrder
    linkedTestId?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CAPACountOrderByAggregateInput
    _max?: CAPAMaxOrderByAggregateInput
    _min?: CAPAMinOrderByAggregateInput
  }

  export type CAPAScalarWhereWithAggregatesInput = {
    AND?: CAPAScalarWhereWithAggregatesInput | CAPAScalarWhereWithAggregatesInput[]
    OR?: CAPAScalarWhereWithAggregatesInput[]
    NOT?: CAPAScalarWhereWithAggregatesInput | CAPAScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CAPA"> | string
    projectId?: StringWithAggregatesFilter<"CAPA"> | string
    title?: StringWithAggregatesFilter<"CAPA"> | string
    status?: StringWithAggregatesFilter<"CAPA"> | string
    rootCause?: StringNullableWithAggregatesFilter<"CAPA"> | string | null
    containment?: StringNullableWithAggregatesFilter<"CAPA"> | string | null
    correctiveAction?: StringNullableWithAggregatesFilter<"CAPA"> | string | null
    preventiveAction?: StringNullableWithAggregatesFilter<"CAPA"> | string | null
    effectivenessCheck?: StringNullableWithAggregatesFilter<"CAPA"> | string | null
    linkedTestId?: StringNullableWithAggregatesFilter<"CAPA"> | string | null
    createdBy?: StringNullableWithAggregatesFilter<"CAPA"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CAPA"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CAPA"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    projectId?: StringFilter<"AuditLog"> | string
    timestamp?: DateTimeFilter<"AuditLog"> | Date | string
    userId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    entityType?: StringFilter<"AuditLog"> | string
    entityId?: StringFilter<"AuditLog"> | string
    previousValue?: JsonNullableFilter<"AuditLog">
    newValue?: JsonNullableFilter<"AuditLog">
    reason?: StringNullableFilter<"AuditLog"> | string | null
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    timestamp?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    previousValue?: SortOrderInput | SortOrder
    newValue?: SortOrderInput | SortOrder
    reason?: SortOrderInput | SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    projectId?: StringFilter<"AuditLog"> | string
    timestamp?: DateTimeFilter<"AuditLog"> | Date | string
    userId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    entityType?: StringFilter<"AuditLog"> | string
    entityId?: StringFilter<"AuditLog"> | string
    previousValue?: JsonNullableFilter<"AuditLog">
    newValue?: JsonNullableFilter<"AuditLog">
    reason?: StringNullableFilter<"AuditLog"> | string | null
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    timestamp?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    previousValue?: SortOrderInput | SortOrder
    newValue?: SortOrderInput | SortOrder
    reason?: SortOrderInput | SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    projectId?: StringWithAggregatesFilter<"AuditLog"> | string
    timestamp?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
    userId?: StringWithAggregatesFilter<"AuditLog"> | string
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    entityType?: StringWithAggregatesFilter<"AuditLog"> | string
    entityId?: StringWithAggregatesFilter<"AuditLog"> | string
    previousValue?: JsonNullableWithAggregatesFilter<"AuditLog">
    newValue?: JsonNullableWithAggregatesFilter<"AuditLog">
    reason?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
  }

  export type UserCreateInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    role?: string
    createdAt?: Date | string
    org?: OrganizationCreateNestedOneWithoutUsersInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    role?: string
    orgId?: string | null
    createdAt?: Date | string
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    org?: OrganizationUpdateOneWithoutUsersNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    orgId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    role?: string
    orgId?: string | null
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    orgId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganizationCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    users?: UserCreateNestedManyWithoutOrgInput
    workspaces?: WorkspaceCreateNestedManyWithoutOrgInput
  }

  export type OrganizationUncheckedCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutOrgInput
    workspaces?: WorkspaceUncheckedCreateNestedManyWithoutOrgInput
  }

  export type OrganizationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutOrgNestedInput
    workspaces?: WorkspaceUpdateManyWithoutOrgNestedInput
  }

  export type OrganizationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutOrgNestedInput
    workspaces?: WorkspaceUncheckedUpdateManyWithoutOrgNestedInput
  }

  export type OrganizationCreateManyInput = {
    id?: string
    name: string
    createdAt?: Date | string
  }

  export type OrganizationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganizationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    org: OrganizationCreateNestedOneWithoutWorkspacesInput
    projects?: ProjectCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateInput = {
    id?: string
    name: string
    orgId: string
    createdAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    org?: OrganizationUpdateOneRequiredWithoutWorkspacesNestedInput
    projects?: ProjectUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceCreateManyInput = {
    id?: string
    name: string
    orgId: string
    createdAt?: Date | string
  }

  export type WorkspaceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateInput = {
    id?: string
    name: string
    description?: string
    owner?: string
    version?: string
    country?: string
    vertical?: string | null
    modules?: ProjectCreatemodulesInput | string[]
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutProjectsInput
    requirements?: RequirementCreateNestedManyWithoutProjectInput
    tests?: TestCreateNestedManyWithoutProjectInput
    risks?: RiskCreateNestedManyWithoutProjectInput
    capas?: CAPACreateNestedManyWithoutProjectInput
    auditLogs?: AuditLogCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    workspaceId: string
    name: string
    description?: string
    owner?: string
    version?: string
    country?: string
    vertical?: string | null
    modules?: ProjectCreatemodulesInput | string[]
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements?: RequirementUncheckedCreateNestedManyWithoutProjectInput
    tests?: TestUncheckedCreateNestedManyWithoutProjectInput
    risks?: RiskUncheckedCreateNestedManyWithoutProjectInput
    capas?: CAPAUncheckedCreateNestedManyWithoutProjectInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    vertical?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: ProjectUpdatemodulesInput | string[]
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutProjectsNestedInput
    requirements?: RequirementUpdateManyWithoutProjectNestedInput
    tests?: TestUpdateManyWithoutProjectNestedInput
    risks?: RiskUpdateManyWithoutProjectNestedInput
    capas?: CAPAUpdateManyWithoutProjectNestedInput
    auditLogs?: AuditLogUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    vertical?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: ProjectUpdatemodulesInput | string[]
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements?: RequirementUncheckedUpdateManyWithoutProjectNestedInput
    tests?: TestUncheckedUpdateManyWithoutProjectNestedInput
    risks?: RiskUncheckedUpdateManyWithoutProjectNestedInput
    capas?: CAPAUncheckedUpdateManyWithoutProjectNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: string
    workspaceId: string
    name: string
    description?: string
    owner?: string
    version?: string
    country?: string
    vertical?: string | null
    modules?: ProjectCreatemodulesInput | string[]
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    vertical?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: ProjectUpdatemodulesInput | string[]
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    vertical?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: ProjectUpdatemodulesInput | string[]
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequirementCreateInput = {
    id?: string
    seqId: string
    title: string
    description?: string
    status?: string
    tags?: RequirementCreatetagsInput | string[]
    riskLevel?: string | null
    regulatoryRef?: string | null
    evidenceHints?: RequirementCreateevidenceHintsInput | string[]
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutRequirementsInput
  }

  export type RequirementUncheckedCreateInput = {
    id?: string
    projectId: string
    seqId: string
    title: string
    description?: string
    status?: string
    tags?: RequirementCreatetagsInput | string[]
    riskLevel?: string | null
    regulatoryRef?: string | null
    evidenceHints?: RequirementCreateevidenceHintsInput | string[]
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RequirementUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    seqId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    tags?: RequirementUpdatetagsInput | string[]
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    regulatoryRef?: NullableStringFieldUpdateOperationsInput | string | null
    evidenceHints?: RequirementUpdateevidenceHintsInput | string[]
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutRequirementsNestedInput
  }

  export type RequirementUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    seqId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    tags?: RequirementUpdatetagsInput | string[]
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    regulatoryRef?: NullableStringFieldUpdateOperationsInput | string | null
    evidenceHints?: RequirementUpdateevidenceHintsInput | string[]
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequirementCreateManyInput = {
    id?: string
    projectId: string
    seqId: string
    title: string
    description?: string
    status?: string
    tags?: RequirementCreatetagsInput | string[]
    riskLevel?: string | null
    regulatoryRef?: string | null
    evidenceHints?: RequirementCreateevidenceHintsInput | string[]
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RequirementUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    seqId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    tags?: RequirementUpdatetagsInput | string[]
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    regulatoryRef?: NullableStringFieldUpdateOperationsInput | string | null
    evidenceHints?: RequirementUpdateevidenceHintsInput | string[]
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequirementUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    seqId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    tags?: RequirementUpdatetagsInput | string[]
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    regulatoryRef?: NullableStringFieldUpdateOperationsInput | string | null
    evidenceHints?: RequirementUpdateevidenceHintsInput | string[]
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TestCreateInput = {
    id?: string
    seqId: string
    title: string
    description?: string
    status?: string
    linkedRequirementIds?: TestCreatelinkedRequirementIdsInput | string[]
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutTestsInput
  }

  export type TestUncheckedCreateInput = {
    id?: string
    projectId: string
    seqId: string
    title: string
    description?: string
    status?: string
    linkedRequirementIds?: TestCreatelinkedRequirementIdsInput | string[]
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    seqId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    linkedRequirementIds?: TestUpdatelinkedRequirementIdsInput | string[]
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutTestsNestedInput
  }

  export type TestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    seqId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    linkedRequirementIds?: TestUpdatelinkedRequirementIdsInput | string[]
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TestCreateManyInput = {
    id?: string
    projectId: string
    seqId: string
    title: string
    description?: string
    status?: string
    linkedRequirementIds?: TestCreatelinkedRequirementIdsInput | string[]
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    seqId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    linkedRequirementIds?: TestUpdatelinkedRequirementIdsInput | string[]
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    seqId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    linkedRequirementIds?: TestUpdatelinkedRequirementIdsInput | string[]
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RiskCreateInput = {
    id?: string
    requirementId: string
    severity: number
    likelihood: number
    detectability?: number | null
    riskScore: number
    riskLevel: string
    mitigation?: string | null
    residualRisk?: number | null
    classifiedBy?: string
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutRisksInput
  }

  export type RiskUncheckedCreateInput = {
    id?: string
    projectId: string
    requirementId: string
    severity: number
    likelihood: number
    detectability?: number | null
    riskScore: number
    riskLevel: string
    mitigation?: string | null
    residualRisk?: number | null
    classifiedBy?: string
    createdAt?: Date | string
  }

  export type RiskUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requirementId?: StringFieldUpdateOperationsInput | string
    severity?: IntFieldUpdateOperationsInput | number
    likelihood?: IntFieldUpdateOperationsInput | number
    detectability?: NullableIntFieldUpdateOperationsInput | number | null
    riskScore?: IntFieldUpdateOperationsInput | number
    riskLevel?: StringFieldUpdateOperationsInput | string
    mitigation?: NullableStringFieldUpdateOperationsInput | string | null
    residualRisk?: NullableIntFieldUpdateOperationsInput | number | null
    classifiedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutRisksNestedInput
  }

  export type RiskUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    requirementId?: StringFieldUpdateOperationsInput | string
    severity?: IntFieldUpdateOperationsInput | number
    likelihood?: IntFieldUpdateOperationsInput | number
    detectability?: NullableIntFieldUpdateOperationsInput | number | null
    riskScore?: IntFieldUpdateOperationsInput | number
    riskLevel?: StringFieldUpdateOperationsInput | string
    mitigation?: NullableStringFieldUpdateOperationsInput | string | null
    residualRisk?: NullableIntFieldUpdateOperationsInput | number | null
    classifiedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RiskCreateManyInput = {
    id?: string
    projectId: string
    requirementId: string
    severity: number
    likelihood: number
    detectability?: number | null
    riskScore: number
    riskLevel: string
    mitigation?: string | null
    residualRisk?: number | null
    classifiedBy?: string
    createdAt?: Date | string
  }

  export type RiskUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    requirementId?: StringFieldUpdateOperationsInput | string
    severity?: IntFieldUpdateOperationsInput | number
    likelihood?: IntFieldUpdateOperationsInput | number
    detectability?: NullableIntFieldUpdateOperationsInput | number | null
    riskScore?: IntFieldUpdateOperationsInput | number
    riskLevel?: StringFieldUpdateOperationsInput | string
    mitigation?: NullableStringFieldUpdateOperationsInput | string | null
    residualRisk?: NullableIntFieldUpdateOperationsInput | number | null
    classifiedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RiskUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    requirementId?: StringFieldUpdateOperationsInput | string
    severity?: IntFieldUpdateOperationsInput | number
    likelihood?: IntFieldUpdateOperationsInput | number
    detectability?: NullableIntFieldUpdateOperationsInput | number | null
    riskScore?: IntFieldUpdateOperationsInput | number
    riskLevel?: StringFieldUpdateOperationsInput | string
    mitigation?: NullableStringFieldUpdateOperationsInput | string | null
    residualRisk?: NullableIntFieldUpdateOperationsInput | number | null
    classifiedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CAPACreateInput = {
    id?: string
    title: string
    status?: string
    rootCause?: string | null
    containment?: string | null
    correctiveAction?: string | null
    preventiveAction?: string | null
    effectivenessCheck?: string | null
    linkedTestId?: string | null
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutCapasInput
  }

  export type CAPAUncheckedCreateInput = {
    id?: string
    projectId: string
    title: string
    status?: string
    rootCause?: string | null
    containment?: string | null
    correctiveAction?: string | null
    preventiveAction?: string | null
    effectivenessCheck?: string | null
    linkedTestId?: string | null
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CAPAUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    rootCause?: NullableStringFieldUpdateOperationsInput | string | null
    containment?: NullableStringFieldUpdateOperationsInput | string | null
    correctiveAction?: NullableStringFieldUpdateOperationsInput | string | null
    preventiveAction?: NullableStringFieldUpdateOperationsInput | string | null
    effectivenessCheck?: NullableStringFieldUpdateOperationsInput | string | null
    linkedTestId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutCapasNestedInput
  }

  export type CAPAUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    rootCause?: NullableStringFieldUpdateOperationsInput | string | null
    containment?: NullableStringFieldUpdateOperationsInput | string | null
    correctiveAction?: NullableStringFieldUpdateOperationsInput | string | null
    preventiveAction?: NullableStringFieldUpdateOperationsInput | string | null
    effectivenessCheck?: NullableStringFieldUpdateOperationsInput | string | null
    linkedTestId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CAPACreateManyInput = {
    id?: string
    projectId: string
    title: string
    status?: string
    rootCause?: string | null
    containment?: string | null
    correctiveAction?: string | null
    preventiveAction?: string | null
    effectivenessCheck?: string | null
    linkedTestId?: string | null
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CAPAUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    rootCause?: NullableStringFieldUpdateOperationsInput | string | null
    containment?: NullableStringFieldUpdateOperationsInput | string | null
    correctiveAction?: NullableStringFieldUpdateOperationsInput | string | null
    preventiveAction?: NullableStringFieldUpdateOperationsInput | string | null
    effectivenessCheck?: NullableStringFieldUpdateOperationsInput | string | null
    linkedTestId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CAPAUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    rootCause?: NullableStringFieldUpdateOperationsInput | string | null
    containment?: NullableStringFieldUpdateOperationsInput | string | null
    correctiveAction?: NullableStringFieldUpdateOperationsInput | string | null
    preventiveAction?: NullableStringFieldUpdateOperationsInput | string | null
    effectivenessCheck?: NullableStringFieldUpdateOperationsInput | string | null
    linkedTestId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    timestamp?: Date | string
    userId: string
    action: string
    entityType: string
    entityId: string
    previousValue?: NullableJsonNullValueInput | InputJsonValue
    newValue?: NullableJsonNullValueInput | InputJsonValue
    reason?: string | null
    project: ProjectCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    projectId: string
    timestamp?: Date | string
    userId: string
    action: string
    entityType: string
    entityId: string
    previousValue?: NullableJsonNullValueInput | InputJsonValue
    newValue?: NullableJsonNullValueInput | InputJsonValue
    reason?: string | null
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    previousValue?: NullableJsonNullValueInput | InputJsonValue
    newValue?: NullableJsonNullValueInput | InputJsonValue
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    project?: ProjectUpdateOneRequiredWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    previousValue?: NullableJsonNullValueInput | InputJsonValue
    newValue?: NullableJsonNullValueInput | InputJsonValue
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuditLogCreateManyInput = {
    id?: string
    projectId: string
    timestamp?: Date | string
    userId: string
    action: string
    entityType: string
    entityId: string
    previousValue?: NullableJsonNullValueInput | InputJsonValue
    newValue?: NullableJsonNullValueInput | InputJsonValue
    reason?: string | null
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    previousValue?: NullableJsonNullValueInput | InputJsonValue
    newValue?: NullableJsonNullValueInput | InputJsonValue
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    previousValue?: NullableJsonNullValueInput | InputJsonValue
    newValue?: NullableJsonNullValueInput | InputJsonValue
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type OrganizationNullableScalarRelationFilter = {
    is?: OrganizationWhereInput | null
    isNot?: OrganizationWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    orgId?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    orgId?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    orgId?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type WorkspaceListRelationFilter = {
    every?: WorkspaceWhereInput
    some?: WorkspaceWhereInput
    none?: WorkspaceWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkspaceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrganizationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type OrganizationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type OrganizationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type OrganizationScalarRelationFilter = {
    is?: OrganizationWhereInput
    isNot?: OrganizationWhereInput
  }

  export type ProjectListRelationFilter = {
    every?: ProjectWhereInput
    some?: ProjectWhereInput
    none?: ProjectWhereInput
  }

  export type ProjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkspaceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    orgId?: SortOrder
    createdAt?: SortOrder
  }

  export type WorkspaceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    orgId?: SortOrder
    createdAt?: SortOrder
  }

  export type WorkspaceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    orgId?: SortOrder
    createdAt?: SortOrder
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type WorkspaceScalarRelationFilter = {
    is?: WorkspaceWhereInput
    isNot?: WorkspaceWhereInput
  }

  export type RequirementListRelationFilter = {
    every?: RequirementWhereInput
    some?: RequirementWhereInput
    none?: RequirementWhereInput
  }

  export type TestListRelationFilter = {
    every?: TestWhereInput
    some?: TestWhereInput
    none?: TestWhereInput
  }

  export type RiskListRelationFilter = {
    every?: RiskWhereInput
    some?: RiskWhereInput
    none?: RiskWhereInput
  }

  export type CAPAListRelationFilter = {
    every?: CAPAWhereInput
    some?: CAPAWhereInput
    none?: CAPAWhereInput
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
  }

  export type RequirementOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RiskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CAPAOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    workspaceId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    owner?: SortOrder
    version?: SortOrder
    country?: SortOrder
    vertical?: SortOrder
    modules?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    workspaceId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    owner?: SortOrder
    version?: SortOrder
    country?: SortOrder
    vertical?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    workspaceId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    owner?: SortOrder
    version?: SortOrder
    country?: SortOrder
    vertical?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectScalarRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type RequirementCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    seqId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    tags?: SortOrder
    riskLevel?: SortOrder
    regulatoryRef?: SortOrder
    evidenceHints?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RequirementMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    seqId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    riskLevel?: SortOrder
    regulatoryRef?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RequirementMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    seqId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    riskLevel?: SortOrder
    regulatoryRef?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TestCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    seqId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    linkedRequirementIds?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TestMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    seqId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TestMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    seqId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type RiskCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    requirementId?: SortOrder
    severity?: SortOrder
    likelihood?: SortOrder
    detectability?: SortOrder
    riskScore?: SortOrder
    riskLevel?: SortOrder
    mitigation?: SortOrder
    residualRisk?: SortOrder
    classifiedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type RiskAvgOrderByAggregateInput = {
    severity?: SortOrder
    likelihood?: SortOrder
    detectability?: SortOrder
    riskScore?: SortOrder
    residualRisk?: SortOrder
  }

  export type RiskMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    requirementId?: SortOrder
    severity?: SortOrder
    likelihood?: SortOrder
    detectability?: SortOrder
    riskScore?: SortOrder
    riskLevel?: SortOrder
    mitigation?: SortOrder
    residualRisk?: SortOrder
    classifiedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type RiskMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    requirementId?: SortOrder
    severity?: SortOrder
    likelihood?: SortOrder
    detectability?: SortOrder
    riskScore?: SortOrder
    riskLevel?: SortOrder
    mitigation?: SortOrder
    residualRisk?: SortOrder
    classifiedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type RiskSumOrderByAggregateInput = {
    severity?: SortOrder
    likelihood?: SortOrder
    detectability?: SortOrder
    riskScore?: SortOrder
    residualRisk?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type CAPACountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    title?: SortOrder
    status?: SortOrder
    rootCause?: SortOrder
    containment?: SortOrder
    correctiveAction?: SortOrder
    preventiveAction?: SortOrder
    effectivenessCheck?: SortOrder
    linkedTestId?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CAPAMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    title?: SortOrder
    status?: SortOrder
    rootCause?: SortOrder
    containment?: SortOrder
    correctiveAction?: SortOrder
    preventiveAction?: SortOrder
    effectivenessCheck?: SortOrder
    linkedTestId?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CAPAMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    title?: SortOrder
    status?: SortOrder
    rootCause?: SortOrder
    containment?: SortOrder
    correctiveAction?: SortOrder
    preventiveAction?: SortOrder
    effectivenessCheck?: SortOrder
    linkedTestId?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    timestamp?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    previousValue?: SortOrder
    newValue?: SortOrder
    reason?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    timestamp?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    reason?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    timestamp?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    reason?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type OrganizationCreateNestedOneWithoutUsersInput = {
    create?: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutUsersInput
    connect?: OrganizationWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type OrganizationUpdateOneWithoutUsersNestedInput = {
    create?: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutUsersInput
    upsert?: OrganizationUpsertWithoutUsersInput
    disconnect?: OrganizationWhereInput | boolean
    delete?: OrganizationWhereInput | boolean
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutUsersInput, OrganizationUpdateWithoutUsersInput>, OrganizationUncheckedUpdateWithoutUsersInput>
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserCreateNestedManyWithoutOrgInput = {
    create?: XOR<UserCreateWithoutOrgInput, UserUncheckedCreateWithoutOrgInput> | UserCreateWithoutOrgInput[] | UserUncheckedCreateWithoutOrgInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrgInput | UserCreateOrConnectWithoutOrgInput[]
    createMany?: UserCreateManyOrgInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type WorkspaceCreateNestedManyWithoutOrgInput = {
    create?: XOR<WorkspaceCreateWithoutOrgInput, WorkspaceUncheckedCreateWithoutOrgInput> | WorkspaceCreateWithoutOrgInput[] | WorkspaceUncheckedCreateWithoutOrgInput[]
    connectOrCreate?: WorkspaceCreateOrConnectWithoutOrgInput | WorkspaceCreateOrConnectWithoutOrgInput[]
    createMany?: WorkspaceCreateManyOrgInputEnvelope
    connect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutOrgInput = {
    create?: XOR<UserCreateWithoutOrgInput, UserUncheckedCreateWithoutOrgInput> | UserCreateWithoutOrgInput[] | UserUncheckedCreateWithoutOrgInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrgInput | UserCreateOrConnectWithoutOrgInput[]
    createMany?: UserCreateManyOrgInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type WorkspaceUncheckedCreateNestedManyWithoutOrgInput = {
    create?: XOR<WorkspaceCreateWithoutOrgInput, WorkspaceUncheckedCreateWithoutOrgInput> | WorkspaceCreateWithoutOrgInput[] | WorkspaceUncheckedCreateWithoutOrgInput[]
    connectOrCreate?: WorkspaceCreateOrConnectWithoutOrgInput | WorkspaceCreateOrConnectWithoutOrgInput[]
    createMany?: WorkspaceCreateManyOrgInputEnvelope
    connect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutOrgNestedInput = {
    create?: XOR<UserCreateWithoutOrgInput, UserUncheckedCreateWithoutOrgInput> | UserCreateWithoutOrgInput[] | UserUncheckedCreateWithoutOrgInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrgInput | UserCreateOrConnectWithoutOrgInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutOrgInput | UserUpsertWithWhereUniqueWithoutOrgInput[]
    createMany?: UserCreateManyOrgInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutOrgInput | UserUpdateWithWhereUniqueWithoutOrgInput[]
    updateMany?: UserUpdateManyWithWhereWithoutOrgInput | UserUpdateManyWithWhereWithoutOrgInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type WorkspaceUpdateManyWithoutOrgNestedInput = {
    create?: XOR<WorkspaceCreateWithoutOrgInput, WorkspaceUncheckedCreateWithoutOrgInput> | WorkspaceCreateWithoutOrgInput[] | WorkspaceUncheckedCreateWithoutOrgInput[]
    connectOrCreate?: WorkspaceCreateOrConnectWithoutOrgInput | WorkspaceCreateOrConnectWithoutOrgInput[]
    upsert?: WorkspaceUpsertWithWhereUniqueWithoutOrgInput | WorkspaceUpsertWithWhereUniqueWithoutOrgInput[]
    createMany?: WorkspaceCreateManyOrgInputEnvelope
    set?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    disconnect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    delete?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    connect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    update?: WorkspaceUpdateWithWhereUniqueWithoutOrgInput | WorkspaceUpdateWithWhereUniqueWithoutOrgInput[]
    updateMany?: WorkspaceUpdateManyWithWhereWithoutOrgInput | WorkspaceUpdateManyWithWhereWithoutOrgInput[]
    deleteMany?: WorkspaceScalarWhereInput | WorkspaceScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutOrgNestedInput = {
    create?: XOR<UserCreateWithoutOrgInput, UserUncheckedCreateWithoutOrgInput> | UserCreateWithoutOrgInput[] | UserUncheckedCreateWithoutOrgInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrgInput | UserCreateOrConnectWithoutOrgInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutOrgInput | UserUpsertWithWhereUniqueWithoutOrgInput[]
    createMany?: UserCreateManyOrgInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutOrgInput | UserUpdateWithWhereUniqueWithoutOrgInput[]
    updateMany?: UserUpdateManyWithWhereWithoutOrgInput | UserUpdateManyWithWhereWithoutOrgInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type WorkspaceUncheckedUpdateManyWithoutOrgNestedInput = {
    create?: XOR<WorkspaceCreateWithoutOrgInput, WorkspaceUncheckedCreateWithoutOrgInput> | WorkspaceCreateWithoutOrgInput[] | WorkspaceUncheckedCreateWithoutOrgInput[]
    connectOrCreate?: WorkspaceCreateOrConnectWithoutOrgInput | WorkspaceCreateOrConnectWithoutOrgInput[]
    upsert?: WorkspaceUpsertWithWhereUniqueWithoutOrgInput | WorkspaceUpsertWithWhereUniqueWithoutOrgInput[]
    createMany?: WorkspaceCreateManyOrgInputEnvelope
    set?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    disconnect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    delete?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    connect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    update?: WorkspaceUpdateWithWhereUniqueWithoutOrgInput | WorkspaceUpdateWithWhereUniqueWithoutOrgInput[]
    updateMany?: WorkspaceUpdateManyWithWhereWithoutOrgInput | WorkspaceUpdateManyWithWhereWithoutOrgInput[]
    deleteMany?: WorkspaceScalarWhereInput | WorkspaceScalarWhereInput[]
  }

  export type OrganizationCreateNestedOneWithoutWorkspacesInput = {
    create?: XOR<OrganizationCreateWithoutWorkspacesInput, OrganizationUncheckedCreateWithoutWorkspacesInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutWorkspacesInput
    connect?: OrganizationWhereUniqueInput
  }

  export type ProjectCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput> | ProjectCreateWithoutWorkspaceInput[] | ProjectUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutWorkspaceInput | ProjectCreateOrConnectWithoutWorkspaceInput[]
    createMany?: ProjectCreateManyWorkspaceInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput> | ProjectCreateWithoutWorkspaceInput[] | ProjectUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutWorkspaceInput | ProjectCreateOrConnectWithoutWorkspaceInput[]
    createMany?: ProjectCreateManyWorkspaceInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type OrganizationUpdateOneRequiredWithoutWorkspacesNestedInput = {
    create?: XOR<OrganizationCreateWithoutWorkspacesInput, OrganizationUncheckedCreateWithoutWorkspacesInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutWorkspacesInput
    upsert?: OrganizationUpsertWithoutWorkspacesInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutWorkspacesInput, OrganizationUpdateWithoutWorkspacesInput>, OrganizationUncheckedUpdateWithoutWorkspacesInput>
  }

  export type ProjectUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput> | ProjectCreateWithoutWorkspaceInput[] | ProjectUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutWorkspaceInput | ProjectCreateOrConnectWithoutWorkspaceInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutWorkspaceInput | ProjectUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: ProjectCreateManyWorkspaceInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutWorkspaceInput | ProjectUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutWorkspaceInput | ProjectUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput> | ProjectCreateWithoutWorkspaceInput[] | ProjectUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutWorkspaceInput | ProjectCreateOrConnectWithoutWorkspaceInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutWorkspaceInput | ProjectUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: ProjectCreateManyWorkspaceInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutWorkspaceInput | ProjectUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutWorkspaceInput | ProjectUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ProjectCreatemodulesInput = {
    set: string[]
  }

  export type WorkspaceCreateNestedOneWithoutProjectsInput = {
    create?: XOR<WorkspaceCreateWithoutProjectsInput, WorkspaceUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutProjectsInput
    connect?: WorkspaceWhereUniqueInput
  }

  export type RequirementCreateNestedManyWithoutProjectInput = {
    create?: XOR<RequirementCreateWithoutProjectInput, RequirementUncheckedCreateWithoutProjectInput> | RequirementCreateWithoutProjectInput[] | RequirementUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: RequirementCreateOrConnectWithoutProjectInput | RequirementCreateOrConnectWithoutProjectInput[]
    createMany?: RequirementCreateManyProjectInputEnvelope
    connect?: RequirementWhereUniqueInput | RequirementWhereUniqueInput[]
  }

  export type TestCreateNestedManyWithoutProjectInput = {
    create?: XOR<TestCreateWithoutProjectInput, TestUncheckedCreateWithoutProjectInput> | TestCreateWithoutProjectInput[] | TestUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TestCreateOrConnectWithoutProjectInput | TestCreateOrConnectWithoutProjectInput[]
    createMany?: TestCreateManyProjectInputEnvelope
    connect?: TestWhereUniqueInput | TestWhereUniqueInput[]
  }

  export type RiskCreateNestedManyWithoutProjectInput = {
    create?: XOR<RiskCreateWithoutProjectInput, RiskUncheckedCreateWithoutProjectInput> | RiskCreateWithoutProjectInput[] | RiskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: RiskCreateOrConnectWithoutProjectInput | RiskCreateOrConnectWithoutProjectInput[]
    createMany?: RiskCreateManyProjectInputEnvelope
    connect?: RiskWhereUniqueInput | RiskWhereUniqueInput[]
  }

  export type CAPACreateNestedManyWithoutProjectInput = {
    create?: XOR<CAPACreateWithoutProjectInput, CAPAUncheckedCreateWithoutProjectInput> | CAPACreateWithoutProjectInput[] | CAPAUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: CAPACreateOrConnectWithoutProjectInput | CAPACreateOrConnectWithoutProjectInput[]
    createMany?: CAPACreateManyProjectInputEnvelope
    connect?: CAPAWhereUniqueInput | CAPAWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutProjectInput = {
    create?: XOR<AuditLogCreateWithoutProjectInput, AuditLogUncheckedCreateWithoutProjectInput> | AuditLogCreateWithoutProjectInput[] | AuditLogUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutProjectInput | AuditLogCreateOrConnectWithoutProjectInput[]
    createMany?: AuditLogCreateManyProjectInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type RequirementUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<RequirementCreateWithoutProjectInput, RequirementUncheckedCreateWithoutProjectInput> | RequirementCreateWithoutProjectInput[] | RequirementUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: RequirementCreateOrConnectWithoutProjectInput | RequirementCreateOrConnectWithoutProjectInput[]
    createMany?: RequirementCreateManyProjectInputEnvelope
    connect?: RequirementWhereUniqueInput | RequirementWhereUniqueInput[]
  }

  export type TestUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<TestCreateWithoutProjectInput, TestUncheckedCreateWithoutProjectInput> | TestCreateWithoutProjectInput[] | TestUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TestCreateOrConnectWithoutProjectInput | TestCreateOrConnectWithoutProjectInput[]
    createMany?: TestCreateManyProjectInputEnvelope
    connect?: TestWhereUniqueInput | TestWhereUniqueInput[]
  }

  export type RiskUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<RiskCreateWithoutProjectInput, RiskUncheckedCreateWithoutProjectInput> | RiskCreateWithoutProjectInput[] | RiskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: RiskCreateOrConnectWithoutProjectInput | RiskCreateOrConnectWithoutProjectInput[]
    createMany?: RiskCreateManyProjectInputEnvelope
    connect?: RiskWhereUniqueInput | RiskWhereUniqueInput[]
  }

  export type CAPAUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<CAPACreateWithoutProjectInput, CAPAUncheckedCreateWithoutProjectInput> | CAPACreateWithoutProjectInput[] | CAPAUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: CAPACreateOrConnectWithoutProjectInput | CAPACreateOrConnectWithoutProjectInput[]
    createMany?: CAPACreateManyProjectInputEnvelope
    connect?: CAPAWhereUniqueInput | CAPAWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<AuditLogCreateWithoutProjectInput, AuditLogUncheckedCreateWithoutProjectInput> | AuditLogCreateWithoutProjectInput[] | AuditLogUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutProjectInput | AuditLogCreateOrConnectWithoutProjectInput[]
    createMany?: AuditLogCreateManyProjectInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type ProjectUpdatemodulesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type WorkspaceUpdateOneRequiredWithoutProjectsNestedInput = {
    create?: XOR<WorkspaceCreateWithoutProjectsInput, WorkspaceUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutProjectsInput
    upsert?: WorkspaceUpsertWithoutProjectsInput
    connect?: WorkspaceWhereUniqueInput
    update?: XOR<XOR<WorkspaceUpdateToOneWithWhereWithoutProjectsInput, WorkspaceUpdateWithoutProjectsInput>, WorkspaceUncheckedUpdateWithoutProjectsInput>
  }

  export type RequirementUpdateManyWithoutProjectNestedInput = {
    create?: XOR<RequirementCreateWithoutProjectInput, RequirementUncheckedCreateWithoutProjectInput> | RequirementCreateWithoutProjectInput[] | RequirementUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: RequirementCreateOrConnectWithoutProjectInput | RequirementCreateOrConnectWithoutProjectInput[]
    upsert?: RequirementUpsertWithWhereUniqueWithoutProjectInput | RequirementUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: RequirementCreateManyProjectInputEnvelope
    set?: RequirementWhereUniqueInput | RequirementWhereUniqueInput[]
    disconnect?: RequirementWhereUniqueInput | RequirementWhereUniqueInput[]
    delete?: RequirementWhereUniqueInput | RequirementWhereUniqueInput[]
    connect?: RequirementWhereUniqueInput | RequirementWhereUniqueInput[]
    update?: RequirementUpdateWithWhereUniqueWithoutProjectInput | RequirementUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: RequirementUpdateManyWithWhereWithoutProjectInput | RequirementUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: RequirementScalarWhereInput | RequirementScalarWhereInput[]
  }

  export type TestUpdateManyWithoutProjectNestedInput = {
    create?: XOR<TestCreateWithoutProjectInput, TestUncheckedCreateWithoutProjectInput> | TestCreateWithoutProjectInput[] | TestUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TestCreateOrConnectWithoutProjectInput | TestCreateOrConnectWithoutProjectInput[]
    upsert?: TestUpsertWithWhereUniqueWithoutProjectInput | TestUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: TestCreateManyProjectInputEnvelope
    set?: TestWhereUniqueInput | TestWhereUniqueInput[]
    disconnect?: TestWhereUniqueInput | TestWhereUniqueInput[]
    delete?: TestWhereUniqueInput | TestWhereUniqueInput[]
    connect?: TestWhereUniqueInput | TestWhereUniqueInput[]
    update?: TestUpdateWithWhereUniqueWithoutProjectInput | TestUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: TestUpdateManyWithWhereWithoutProjectInput | TestUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: TestScalarWhereInput | TestScalarWhereInput[]
  }

  export type RiskUpdateManyWithoutProjectNestedInput = {
    create?: XOR<RiskCreateWithoutProjectInput, RiskUncheckedCreateWithoutProjectInput> | RiskCreateWithoutProjectInput[] | RiskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: RiskCreateOrConnectWithoutProjectInput | RiskCreateOrConnectWithoutProjectInput[]
    upsert?: RiskUpsertWithWhereUniqueWithoutProjectInput | RiskUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: RiskCreateManyProjectInputEnvelope
    set?: RiskWhereUniqueInput | RiskWhereUniqueInput[]
    disconnect?: RiskWhereUniqueInput | RiskWhereUniqueInput[]
    delete?: RiskWhereUniqueInput | RiskWhereUniqueInput[]
    connect?: RiskWhereUniqueInput | RiskWhereUniqueInput[]
    update?: RiskUpdateWithWhereUniqueWithoutProjectInput | RiskUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: RiskUpdateManyWithWhereWithoutProjectInput | RiskUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: RiskScalarWhereInput | RiskScalarWhereInput[]
  }

  export type CAPAUpdateManyWithoutProjectNestedInput = {
    create?: XOR<CAPACreateWithoutProjectInput, CAPAUncheckedCreateWithoutProjectInput> | CAPACreateWithoutProjectInput[] | CAPAUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: CAPACreateOrConnectWithoutProjectInput | CAPACreateOrConnectWithoutProjectInput[]
    upsert?: CAPAUpsertWithWhereUniqueWithoutProjectInput | CAPAUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: CAPACreateManyProjectInputEnvelope
    set?: CAPAWhereUniqueInput | CAPAWhereUniqueInput[]
    disconnect?: CAPAWhereUniqueInput | CAPAWhereUniqueInput[]
    delete?: CAPAWhereUniqueInput | CAPAWhereUniqueInput[]
    connect?: CAPAWhereUniqueInput | CAPAWhereUniqueInput[]
    update?: CAPAUpdateWithWhereUniqueWithoutProjectInput | CAPAUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: CAPAUpdateManyWithWhereWithoutProjectInput | CAPAUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: CAPAScalarWhereInput | CAPAScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutProjectNestedInput = {
    create?: XOR<AuditLogCreateWithoutProjectInput, AuditLogUncheckedCreateWithoutProjectInput> | AuditLogCreateWithoutProjectInput[] | AuditLogUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutProjectInput | AuditLogCreateOrConnectWithoutProjectInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutProjectInput | AuditLogUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: AuditLogCreateManyProjectInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutProjectInput | AuditLogUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutProjectInput | AuditLogUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type RequirementUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<RequirementCreateWithoutProjectInput, RequirementUncheckedCreateWithoutProjectInput> | RequirementCreateWithoutProjectInput[] | RequirementUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: RequirementCreateOrConnectWithoutProjectInput | RequirementCreateOrConnectWithoutProjectInput[]
    upsert?: RequirementUpsertWithWhereUniqueWithoutProjectInput | RequirementUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: RequirementCreateManyProjectInputEnvelope
    set?: RequirementWhereUniqueInput | RequirementWhereUniqueInput[]
    disconnect?: RequirementWhereUniqueInput | RequirementWhereUniqueInput[]
    delete?: RequirementWhereUniqueInput | RequirementWhereUniqueInput[]
    connect?: RequirementWhereUniqueInput | RequirementWhereUniqueInput[]
    update?: RequirementUpdateWithWhereUniqueWithoutProjectInput | RequirementUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: RequirementUpdateManyWithWhereWithoutProjectInput | RequirementUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: RequirementScalarWhereInput | RequirementScalarWhereInput[]
  }

  export type TestUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<TestCreateWithoutProjectInput, TestUncheckedCreateWithoutProjectInput> | TestCreateWithoutProjectInput[] | TestUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TestCreateOrConnectWithoutProjectInput | TestCreateOrConnectWithoutProjectInput[]
    upsert?: TestUpsertWithWhereUniqueWithoutProjectInput | TestUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: TestCreateManyProjectInputEnvelope
    set?: TestWhereUniqueInput | TestWhereUniqueInput[]
    disconnect?: TestWhereUniqueInput | TestWhereUniqueInput[]
    delete?: TestWhereUniqueInput | TestWhereUniqueInput[]
    connect?: TestWhereUniqueInput | TestWhereUniqueInput[]
    update?: TestUpdateWithWhereUniqueWithoutProjectInput | TestUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: TestUpdateManyWithWhereWithoutProjectInput | TestUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: TestScalarWhereInput | TestScalarWhereInput[]
  }

  export type RiskUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<RiskCreateWithoutProjectInput, RiskUncheckedCreateWithoutProjectInput> | RiskCreateWithoutProjectInput[] | RiskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: RiskCreateOrConnectWithoutProjectInput | RiskCreateOrConnectWithoutProjectInput[]
    upsert?: RiskUpsertWithWhereUniqueWithoutProjectInput | RiskUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: RiskCreateManyProjectInputEnvelope
    set?: RiskWhereUniqueInput | RiskWhereUniqueInput[]
    disconnect?: RiskWhereUniqueInput | RiskWhereUniqueInput[]
    delete?: RiskWhereUniqueInput | RiskWhereUniqueInput[]
    connect?: RiskWhereUniqueInput | RiskWhereUniqueInput[]
    update?: RiskUpdateWithWhereUniqueWithoutProjectInput | RiskUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: RiskUpdateManyWithWhereWithoutProjectInput | RiskUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: RiskScalarWhereInput | RiskScalarWhereInput[]
  }

  export type CAPAUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<CAPACreateWithoutProjectInput, CAPAUncheckedCreateWithoutProjectInput> | CAPACreateWithoutProjectInput[] | CAPAUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: CAPACreateOrConnectWithoutProjectInput | CAPACreateOrConnectWithoutProjectInput[]
    upsert?: CAPAUpsertWithWhereUniqueWithoutProjectInput | CAPAUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: CAPACreateManyProjectInputEnvelope
    set?: CAPAWhereUniqueInput | CAPAWhereUniqueInput[]
    disconnect?: CAPAWhereUniqueInput | CAPAWhereUniqueInput[]
    delete?: CAPAWhereUniqueInput | CAPAWhereUniqueInput[]
    connect?: CAPAWhereUniqueInput | CAPAWhereUniqueInput[]
    update?: CAPAUpdateWithWhereUniqueWithoutProjectInput | CAPAUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: CAPAUpdateManyWithWhereWithoutProjectInput | CAPAUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: CAPAScalarWhereInput | CAPAScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<AuditLogCreateWithoutProjectInput, AuditLogUncheckedCreateWithoutProjectInput> | AuditLogCreateWithoutProjectInput[] | AuditLogUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutProjectInput | AuditLogCreateOrConnectWithoutProjectInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutProjectInput | AuditLogUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: AuditLogCreateManyProjectInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutProjectInput | AuditLogUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutProjectInput | AuditLogUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type RequirementCreatetagsInput = {
    set: string[]
  }

  export type RequirementCreateevidenceHintsInput = {
    set: string[]
  }

  export type ProjectCreateNestedOneWithoutRequirementsInput = {
    create?: XOR<ProjectCreateWithoutRequirementsInput, ProjectUncheckedCreateWithoutRequirementsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutRequirementsInput
    connect?: ProjectWhereUniqueInput
  }

  export type RequirementUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type RequirementUpdateevidenceHintsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ProjectUpdateOneRequiredWithoutRequirementsNestedInput = {
    create?: XOR<ProjectCreateWithoutRequirementsInput, ProjectUncheckedCreateWithoutRequirementsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutRequirementsInput
    upsert?: ProjectUpsertWithoutRequirementsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutRequirementsInput, ProjectUpdateWithoutRequirementsInput>, ProjectUncheckedUpdateWithoutRequirementsInput>
  }

  export type TestCreatelinkedRequirementIdsInput = {
    set: string[]
  }

  export type ProjectCreateNestedOneWithoutTestsInput = {
    create?: XOR<ProjectCreateWithoutTestsInput, ProjectUncheckedCreateWithoutTestsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutTestsInput
    connect?: ProjectWhereUniqueInput
  }

  export type TestUpdatelinkedRequirementIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ProjectUpdateOneRequiredWithoutTestsNestedInput = {
    create?: XOR<ProjectCreateWithoutTestsInput, ProjectUncheckedCreateWithoutTestsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutTestsInput
    upsert?: ProjectUpsertWithoutTestsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutTestsInput, ProjectUpdateWithoutTestsInput>, ProjectUncheckedUpdateWithoutTestsInput>
  }

  export type ProjectCreateNestedOneWithoutRisksInput = {
    create?: XOR<ProjectCreateWithoutRisksInput, ProjectUncheckedCreateWithoutRisksInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutRisksInput
    connect?: ProjectWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProjectUpdateOneRequiredWithoutRisksNestedInput = {
    create?: XOR<ProjectCreateWithoutRisksInput, ProjectUncheckedCreateWithoutRisksInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutRisksInput
    upsert?: ProjectUpsertWithoutRisksInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutRisksInput, ProjectUpdateWithoutRisksInput>, ProjectUncheckedUpdateWithoutRisksInput>
  }

  export type ProjectCreateNestedOneWithoutCapasInput = {
    create?: XOR<ProjectCreateWithoutCapasInput, ProjectUncheckedCreateWithoutCapasInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutCapasInput
    connect?: ProjectWhereUniqueInput
  }

  export type ProjectUpdateOneRequiredWithoutCapasNestedInput = {
    create?: XOR<ProjectCreateWithoutCapasInput, ProjectUncheckedCreateWithoutCapasInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutCapasInput
    upsert?: ProjectUpsertWithoutCapasInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutCapasInput, ProjectUpdateWithoutCapasInput>, ProjectUncheckedUpdateWithoutCapasInput>
  }

  export type ProjectCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<ProjectCreateWithoutAuditLogsInput, ProjectUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutAuditLogsInput
    connect?: ProjectWhereUniqueInput
  }

  export type ProjectUpdateOneRequiredWithoutAuditLogsNestedInput = {
    create?: XOR<ProjectCreateWithoutAuditLogsInput, ProjectUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutAuditLogsInput
    upsert?: ProjectUpsertWithoutAuditLogsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutAuditLogsInput, ProjectUpdateWithoutAuditLogsInput>, ProjectUncheckedUpdateWithoutAuditLogsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type OrganizationCreateWithoutUsersInput = {
    id?: string
    name: string
    createdAt?: Date | string
    workspaces?: WorkspaceCreateNestedManyWithoutOrgInput
  }

  export type OrganizationUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    createdAt?: Date | string
    workspaces?: WorkspaceUncheckedCreateNestedManyWithoutOrgInput
  }

  export type OrganizationCreateOrConnectWithoutUsersInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
  }

  export type OrganizationUpsertWithoutUsersInput = {
    update: XOR<OrganizationUpdateWithoutUsersInput, OrganizationUncheckedUpdateWithoutUsersInput>
    create: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutUsersInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutUsersInput, OrganizationUncheckedUpdateWithoutUsersInput>
  }

  export type OrganizationUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspaces?: WorkspaceUpdateManyWithoutOrgNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspaces?: WorkspaceUncheckedUpdateManyWithoutOrgNestedInput
  }

  export type UserCreateWithoutOrgInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    role?: string
    createdAt?: Date | string
  }

  export type UserUncheckedCreateWithoutOrgInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    role?: string
    createdAt?: Date | string
  }

  export type UserCreateOrConnectWithoutOrgInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOrgInput, UserUncheckedCreateWithoutOrgInput>
  }

  export type UserCreateManyOrgInputEnvelope = {
    data: UserCreateManyOrgInput | UserCreateManyOrgInput[]
    skipDuplicates?: boolean
  }

  export type WorkspaceCreateWithoutOrgInput = {
    id?: string
    name: string
    createdAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateWithoutOrgInput = {
    id?: string
    name: string
    createdAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceCreateOrConnectWithoutOrgInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutOrgInput, WorkspaceUncheckedCreateWithoutOrgInput>
  }

  export type WorkspaceCreateManyOrgInputEnvelope = {
    data: WorkspaceCreateManyOrgInput | WorkspaceCreateManyOrgInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutOrgInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutOrgInput, UserUncheckedUpdateWithoutOrgInput>
    create: XOR<UserCreateWithoutOrgInput, UserUncheckedCreateWithoutOrgInput>
  }

  export type UserUpdateWithWhereUniqueWithoutOrgInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutOrgInput, UserUncheckedUpdateWithoutOrgInput>
  }

  export type UserUpdateManyWithWhereWithoutOrgInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutOrgInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    orgId?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
  }

  export type WorkspaceUpsertWithWhereUniqueWithoutOrgInput = {
    where: WorkspaceWhereUniqueInput
    update: XOR<WorkspaceUpdateWithoutOrgInput, WorkspaceUncheckedUpdateWithoutOrgInput>
    create: XOR<WorkspaceCreateWithoutOrgInput, WorkspaceUncheckedCreateWithoutOrgInput>
  }

  export type WorkspaceUpdateWithWhereUniqueWithoutOrgInput = {
    where: WorkspaceWhereUniqueInput
    data: XOR<WorkspaceUpdateWithoutOrgInput, WorkspaceUncheckedUpdateWithoutOrgInput>
  }

  export type WorkspaceUpdateManyWithWhereWithoutOrgInput = {
    where: WorkspaceScalarWhereInput
    data: XOR<WorkspaceUpdateManyMutationInput, WorkspaceUncheckedUpdateManyWithoutOrgInput>
  }

  export type WorkspaceScalarWhereInput = {
    AND?: WorkspaceScalarWhereInput | WorkspaceScalarWhereInput[]
    OR?: WorkspaceScalarWhereInput[]
    NOT?: WorkspaceScalarWhereInput | WorkspaceScalarWhereInput[]
    id?: StringFilter<"Workspace"> | string
    name?: StringFilter<"Workspace"> | string
    orgId?: StringFilter<"Workspace"> | string
    createdAt?: DateTimeFilter<"Workspace"> | Date | string
  }

  export type OrganizationCreateWithoutWorkspacesInput = {
    id?: string
    name: string
    createdAt?: Date | string
    users?: UserCreateNestedManyWithoutOrgInput
  }

  export type OrganizationUncheckedCreateWithoutWorkspacesInput = {
    id?: string
    name: string
    createdAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutOrgInput
  }

  export type OrganizationCreateOrConnectWithoutWorkspacesInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutWorkspacesInput, OrganizationUncheckedCreateWithoutWorkspacesInput>
  }

  export type ProjectCreateWithoutWorkspaceInput = {
    id?: string
    name: string
    description?: string
    owner?: string
    version?: string
    country?: string
    vertical?: string | null
    modules?: ProjectCreatemodulesInput | string[]
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements?: RequirementCreateNestedManyWithoutProjectInput
    tests?: TestCreateNestedManyWithoutProjectInput
    risks?: RiskCreateNestedManyWithoutProjectInput
    capas?: CAPACreateNestedManyWithoutProjectInput
    auditLogs?: AuditLogCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutWorkspaceInput = {
    id?: string
    name: string
    description?: string
    owner?: string
    version?: string
    country?: string
    vertical?: string | null
    modules?: ProjectCreatemodulesInput | string[]
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements?: RequirementUncheckedCreateNestedManyWithoutProjectInput
    tests?: TestUncheckedCreateNestedManyWithoutProjectInput
    risks?: RiskUncheckedCreateNestedManyWithoutProjectInput
    capas?: CAPAUncheckedCreateNestedManyWithoutProjectInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutWorkspaceInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput>
  }

  export type ProjectCreateManyWorkspaceInputEnvelope = {
    data: ProjectCreateManyWorkspaceInput | ProjectCreateManyWorkspaceInput[]
    skipDuplicates?: boolean
  }

  export type OrganizationUpsertWithoutWorkspacesInput = {
    update: XOR<OrganizationUpdateWithoutWorkspacesInput, OrganizationUncheckedUpdateWithoutWorkspacesInput>
    create: XOR<OrganizationCreateWithoutWorkspacesInput, OrganizationUncheckedCreateWithoutWorkspacesInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutWorkspacesInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutWorkspacesInput, OrganizationUncheckedUpdateWithoutWorkspacesInput>
  }

  export type OrganizationUpdateWithoutWorkspacesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutOrgNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutWorkspacesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutOrgNestedInput
  }

  export type ProjectUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutWorkspaceInput, ProjectUncheckedUpdateWithoutWorkspaceInput>
    create: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutWorkspaceInput, ProjectUncheckedUpdateWithoutWorkspaceInput>
  }

  export type ProjectUpdateManyWithWhereWithoutWorkspaceInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutWorkspaceInput>
  }

  export type ProjectScalarWhereInput = {
    AND?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    OR?: ProjectScalarWhereInput[]
    NOT?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    id?: StringFilter<"Project"> | string
    workspaceId?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    description?: StringFilter<"Project"> | string
    owner?: StringFilter<"Project"> | string
    version?: StringFilter<"Project"> | string
    country?: StringFilter<"Project"> | string
    vertical?: StringNullableFilter<"Project"> | string | null
    modules?: StringNullableListFilter<"Project">
    type?: StringFilter<"Project"> | string
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
  }

  export type WorkspaceCreateWithoutProjectsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    org: OrganizationCreateNestedOneWithoutWorkspacesInput
  }

  export type WorkspaceUncheckedCreateWithoutProjectsInput = {
    id?: string
    name: string
    orgId: string
    createdAt?: Date | string
  }

  export type WorkspaceCreateOrConnectWithoutProjectsInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutProjectsInput, WorkspaceUncheckedCreateWithoutProjectsInput>
  }

  export type RequirementCreateWithoutProjectInput = {
    id?: string
    seqId: string
    title: string
    description?: string
    status?: string
    tags?: RequirementCreatetagsInput | string[]
    riskLevel?: string | null
    regulatoryRef?: string | null
    evidenceHints?: RequirementCreateevidenceHintsInput | string[]
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RequirementUncheckedCreateWithoutProjectInput = {
    id?: string
    seqId: string
    title: string
    description?: string
    status?: string
    tags?: RequirementCreatetagsInput | string[]
    riskLevel?: string | null
    regulatoryRef?: string | null
    evidenceHints?: RequirementCreateevidenceHintsInput | string[]
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RequirementCreateOrConnectWithoutProjectInput = {
    where: RequirementWhereUniqueInput
    create: XOR<RequirementCreateWithoutProjectInput, RequirementUncheckedCreateWithoutProjectInput>
  }

  export type RequirementCreateManyProjectInputEnvelope = {
    data: RequirementCreateManyProjectInput | RequirementCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type TestCreateWithoutProjectInput = {
    id?: string
    seqId: string
    title: string
    description?: string
    status?: string
    linkedRequirementIds?: TestCreatelinkedRequirementIdsInput | string[]
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TestUncheckedCreateWithoutProjectInput = {
    id?: string
    seqId: string
    title: string
    description?: string
    status?: string
    linkedRequirementIds?: TestCreatelinkedRequirementIdsInput | string[]
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TestCreateOrConnectWithoutProjectInput = {
    where: TestWhereUniqueInput
    create: XOR<TestCreateWithoutProjectInput, TestUncheckedCreateWithoutProjectInput>
  }

  export type TestCreateManyProjectInputEnvelope = {
    data: TestCreateManyProjectInput | TestCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type RiskCreateWithoutProjectInput = {
    id?: string
    requirementId: string
    severity: number
    likelihood: number
    detectability?: number | null
    riskScore: number
    riskLevel: string
    mitigation?: string | null
    residualRisk?: number | null
    classifiedBy?: string
    createdAt?: Date | string
  }

  export type RiskUncheckedCreateWithoutProjectInput = {
    id?: string
    requirementId: string
    severity: number
    likelihood: number
    detectability?: number | null
    riskScore: number
    riskLevel: string
    mitigation?: string | null
    residualRisk?: number | null
    classifiedBy?: string
    createdAt?: Date | string
  }

  export type RiskCreateOrConnectWithoutProjectInput = {
    where: RiskWhereUniqueInput
    create: XOR<RiskCreateWithoutProjectInput, RiskUncheckedCreateWithoutProjectInput>
  }

  export type RiskCreateManyProjectInputEnvelope = {
    data: RiskCreateManyProjectInput | RiskCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type CAPACreateWithoutProjectInput = {
    id?: string
    title: string
    status?: string
    rootCause?: string | null
    containment?: string | null
    correctiveAction?: string | null
    preventiveAction?: string | null
    effectivenessCheck?: string | null
    linkedTestId?: string | null
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CAPAUncheckedCreateWithoutProjectInput = {
    id?: string
    title: string
    status?: string
    rootCause?: string | null
    containment?: string | null
    correctiveAction?: string | null
    preventiveAction?: string | null
    effectivenessCheck?: string | null
    linkedTestId?: string | null
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CAPACreateOrConnectWithoutProjectInput = {
    where: CAPAWhereUniqueInput
    create: XOR<CAPACreateWithoutProjectInput, CAPAUncheckedCreateWithoutProjectInput>
  }

  export type CAPACreateManyProjectInputEnvelope = {
    data: CAPACreateManyProjectInput | CAPACreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type AuditLogCreateWithoutProjectInput = {
    id?: string
    timestamp?: Date | string
    userId: string
    action: string
    entityType: string
    entityId: string
    previousValue?: NullableJsonNullValueInput | InputJsonValue
    newValue?: NullableJsonNullValueInput | InputJsonValue
    reason?: string | null
  }

  export type AuditLogUncheckedCreateWithoutProjectInput = {
    id?: string
    timestamp?: Date | string
    userId: string
    action: string
    entityType: string
    entityId: string
    previousValue?: NullableJsonNullValueInput | InputJsonValue
    newValue?: NullableJsonNullValueInput | InputJsonValue
    reason?: string | null
  }

  export type AuditLogCreateOrConnectWithoutProjectInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutProjectInput, AuditLogUncheckedCreateWithoutProjectInput>
  }

  export type AuditLogCreateManyProjectInputEnvelope = {
    data: AuditLogCreateManyProjectInput | AuditLogCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type WorkspaceUpsertWithoutProjectsInput = {
    update: XOR<WorkspaceUpdateWithoutProjectsInput, WorkspaceUncheckedUpdateWithoutProjectsInput>
    create: XOR<WorkspaceCreateWithoutProjectsInput, WorkspaceUncheckedCreateWithoutProjectsInput>
    where?: WorkspaceWhereInput
  }

  export type WorkspaceUpdateToOneWithWhereWithoutProjectsInput = {
    where?: WorkspaceWhereInput
    data: XOR<WorkspaceUpdateWithoutProjectsInput, WorkspaceUncheckedUpdateWithoutProjectsInput>
  }

  export type WorkspaceUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    org?: OrganizationUpdateOneRequiredWithoutWorkspacesNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequirementUpsertWithWhereUniqueWithoutProjectInput = {
    where: RequirementWhereUniqueInput
    update: XOR<RequirementUpdateWithoutProjectInput, RequirementUncheckedUpdateWithoutProjectInput>
    create: XOR<RequirementCreateWithoutProjectInput, RequirementUncheckedCreateWithoutProjectInput>
  }

  export type RequirementUpdateWithWhereUniqueWithoutProjectInput = {
    where: RequirementWhereUniqueInput
    data: XOR<RequirementUpdateWithoutProjectInput, RequirementUncheckedUpdateWithoutProjectInput>
  }

  export type RequirementUpdateManyWithWhereWithoutProjectInput = {
    where: RequirementScalarWhereInput
    data: XOR<RequirementUpdateManyMutationInput, RequirementUncheckedUpdateManyWithoutProjectInput>
  }

  export type RequirementScalarWhereInput = {
    AND?: RequirementScalarWhereInput | RequirementScalarWhereInput[]
    OR?: RequirementScalarWhereInput[]
    NOT?: RequirementScalarWhereInput | RequirementScalarWhereInput[]
    id?: StringFilter<"Requirement"> | string
    projectId?: StringFilter<"Requirement"> | string
    seqId?: StringFilter<"Requirement"> | string
    title?: StringFilter<"Requirement"> | string
    description?: StringFilter<"Requirement"> | string
    status?: StringFilter<"Requirement"> | string
    tags?: StringNullableListFilter<"Requirement">
    riskLevel?: StringNullableFilter<"Requirement"> | string | null
    regulatoryRef?: StringNullableFilter<"Requirement"> | string | null
    evidenceHints?: StringNullableListFilter<"Requirement">
    createdBy?: StringNullableFilter<"Requirement"> | string | null
    createdAt?: DateTimeFilter<"Requirement"> | Date | string
    updatedAt?: DateTimeFilter<"Requirement"> | Date | string
  }

  export type TestUpsertWithWhereUniqueWithoutProjectInput = {
    where: TestWhereUniqueInput
    update: XOR<TestUpdateWithoutProjectInput, TestUncheckedUpdateWithoutProjectInput>
    create: XOR<TestCreateWithoutProjectInput, TestUncheckedCreateWithoutProjectInput>
  }

  export type TestUpdateWithWhereUniqueWithoutProjectInput = {
    where: TestWhereUniqueInput
    data: XOR<TestUpdateWithoutProjectInput, TestUncheckedUpdateWithoutProjectInput>
  }

  export type TestUpdateManyWithWhereWithoutProjectInput = {
    where: TestScalarWhereInput
    data: XOR<TestUpdateManyMutationInput, TestUncheckedUpdateManyWithoutProjectInput>
  }

  export type TestScalarWhereInput = {
    AND?: TestScalarWhereInput | TestScalarWhereInput[]
    OR?: TestScalarWhereInput[]
    NOT?: TestScalarWhereInput | TestScalarWhereInput[]
    id?: StringFilter<"Test"> | string
    projectId?: StringFilter<"Test"> | string
    seqId?: StringFilter<"Test"> | string
    title?: StringFilter<"Test"> | string
    description?: StringFilter<"Test"> | string
    status?: StringFilter<"Test"> | string
    linkedRequirementIds?: StringNullableListFilter<"Test">
    createdBy?: StringNullableFilter<"Test"> | string | null
    createdAt?: DateTimeFilter<"Test"> | Date | string
    updatedAt?: DateTimeFilter<"Test"> | Date | string
  }

  export type RiskUpsertWithWhereUniqueWithoutProjectInput = {
    where: RiskWhereUniqueInput
    update: XOR<RiskUpdateWithoutProjectInput, RiskUncheckedUpdateWithoutProjectInput>
    create: XOR<RiskCreateWithoutProjectInput, RiskUncheckedCreateWithoutProjectInput>
  }

  export type RiskUpdateWithWhereUniqueWithoutProjectInput = {
    where: RiskWhereUniqueInput
    data: XOR<RiskUpdateWithoutProjectInput, RiskUncheckedUpdateWithoutProjectInput>
  }

  export type RiskUpdateManyWithWhereWithoutProjectInput = {
    where: RiskScalarWhereInput
    data: XOR<RiskUpdateManyMutationInput, RiskUncheckedUpdateManyWithoutProjectInput>
  }

  export type RiskScalarWhereInput = {
    AND?: RiskScalarWhereInput | RiskScalarWhereInput[]
    OR?: RiskScalarWhereInput[]
    NOT?: RiskScalarWhereInput | RiskScalarWhereInput[]
    id?: StringFilter<"Risk"> | string
    projectId?: StringFilter<"Risk"> | string
    requirementId?: StringFilter<"Risk"> | string
    severity?: IntFilter<"Risk"> | number
    likelihood?: IntFilter<"Risk"> | number
    detectability?: IntNullableFilter<"Risk"> | number | null
    riskScore?: IntFilter<"Risk"> | number
    riskLevel?: StringFilter<"Risk"> | string
    mitigation?: StringNullableFilter<"Risk"> | string | null
    residualRisk?: IntNullableFilter<"Risk"> | number | null
    classifiedBy?: StringFilter<"Risk"> | string
    createdAt?: DateTimeFilter<"Risk"> | Date | string
  }

  export type CAPAUpsertWithWhereUniqueWithoutProjectInput = {
    where: CAPAWhereUniqueInput
    update: XOR<CAPAUpdateWithoutProjectInput, CAPAUncheckedUpdateWithoutProjectInput>
    create: XOR<CAPACreateWithoutProjectInput, CAPAUncheckedCreateWithoutProjectInput>
  }

  export type CAPAUpdateWithWhereUniqueWithoutProjectInput = {
    where: CAPAWhereUniqueInput
    data: XOR<CAPAUpdateWithoutProjectInput, CAPAUncheckedUpdateWithoutProjectInput>
  }

  export type CAPAUpdateManyWithWhereWithoutProjectInput = {
    where: CAPAScalarWhereInput
    data: XOR<CAPAUpdateManyMutationInput, CAPAUncheckedUpdateManyWithoutProjectInput>
  }

  export type CAPAScalarWhereInput = {
    AND?: CAPAScalarWhereInput | CAPAScalarWhereInput[]
    OR?: CAPAScalarWhereInput[]
    NOT?: CAPAScalarWhereInput | CAPAScalarWhereInput[]
    id?: StringFilter<"CAPA"> | string
    projectId?: StringFilter<"CAPA"> | string
    title?: StringFilter<"CAPA"> | string
    status?: StringFilter<"CAPA"> | string
    rootCause?: StringNullableFilter<"CAPA"> | string | null
    containment?: StringNullableFilter<"CAPA"> | string | null
    correctiveAction?: StringNullableFilter<"CAPA"> | string | null
    preventiveAction?: StringNullableFilter<"CAPA"> | string | null
    effectivenessCheck?: StringNullableFilter<"CAPA"> | string | null
    linkedTestId?: StringNullableFilter<"CAPA"> | string | null
    createdBy?: StringNullableFilter<"CAPA"> | string | null
    createdAt?: DateTimeFilter<"CAPA"> | Date | string
    updatedAt?: DateTimeFilter<"CAPA"> | Date | string
  }

  export type AuditLogUpsertWithWhereUniqueWithoutProjectInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutProjectInput, AuditLogUncheckedUpdateWithoutProjectInput>
    create: XOR<AuditLogCreateWithoutProjectInput, AuditLogUncheckedCreateWithoutProjectInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutProjectInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutProjectInput, AuditLogUncheckedUpdateWithoutProjectInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutProjectInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutProjectInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    projectId?: StringFilter<"AuditLog"> | string
    timestamp?: DateTimeFilter<"AuditLog"> | Date | string
    userId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    entityType?: StringFilter<"AuditLog"> | string
    entityId?: StringFilter<"AuditLog"> | string
    previousValue?: JsonNullableFilter<"AuditLog">
    newValue?: JsonNullableFilter<"AuditLog">
    reason?: StringNullableFilter<"AuditLog"> | string | null
  }

  export type ProjectCreateWithoutRequirementsInput = {
    id?: string
    name: string
    description?: string
    owner?: string
    version?: string
    country?: string
    vertical?: string | null
    modules?: ProjectCreatemodulesInput | string[]
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutProjectsInput
    tests?: TestCreateNestedManyWithoutProjectInput
    risks?: RiskCreateNestedManyWithoutProjectInput
    capas?: CAPACreateNestedManyWithoutProjectInput
    auditLogs?: AuditLogCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutRequirementsInput = {
    id?: string
    workspaceId: string
    name: string
    description?: string
    owner?: string
    version?: string
    country?: string
    vertical?: string | null
    modules?: ProjectCreatemodulesInput | string[]
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tests?: TestUncheckedCreateNestedManyWithoutProjectInput
    risks?: RiskUncheckedCreateNestedManyWithoutProjectInput
    capas?: CAPAUncheckedCreateNestedManyWithoutProjectInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutRequirementsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutRequirementsInput, ProjectUncheckedCreateWithoutRequirementsInput>
  }

  export type ProjectUpsertWithoutRequirementsInput = {
    update: XOR<ProjectUpdateWithoutRequirementsInput, ProjectUncheckedUpdateWithoutRequirementsInput>
    create: XOR<ProjectCreateWithoutRequirementsInput, ProjectUncheckedCreateWithoutRequirementsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutRequirementsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutRequirementsInput, ProjectUncheckedUpdateWithoutRequirementsInput>
  }

  export type ProjectUpdateWithoutRequirementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    vertical?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: ProjectUpdatemodulesInput | string[]
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutProjectsNestedInput
    tests?: TestUpdateManyWithoutProjectNestedInput
    risks?: RiskUpdateManyWithoutProjectNestedInput
    capas?: CAPAUpdateManyWithoutProjectNestedInput
    auditLogs?: AuditLogUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutRequirementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    vertical?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: ProjectUpdatemodulesInput | string[]
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tests?: TestUncheckedUpdateManyWithoutProjectNestedInput
    risks?: RiskUncheckedUpdateManyWithoutProjectNestedInput
    capas?: CAPAUncheckedUpdateManyWithoutProjectNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateWithoutTestsInput = {
    id?: string
    name: string
    description?: string
    owner?: string
    version?: string
    country?: string
    vertical?: string | null
    modules?: ProjectCreatemodulesInput | string[]
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutProjectsInput
    requirements?: RequirementCreateNestedManyWithoutProjectInput
    risks?: RiskCreateNestedManyWithoutProjectInput
    capas?: CAPACreateNestedManyWithoutProjectInput
    auditLogs?: AuditLogCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutTestsInput = {
    id?: string
    workspaceId: string
    name: string
    description?: string
    owner?: string
    version?: string
    country?: string
    vertical?: string | null
    modules?: ProjectCreatemodulesInput | string[]
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements?: RequirementUncheckedCreateNestedManyWithoutProjectInput
    risks?: RiskUncheckedCreateNestedManyWithoutProjectInput
    capas?: CAPAUncheckedCreateNestedManyWithoutProjectInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutTestsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutTestsInput, ProjectUncheckedCreateWithoutTestsInput>
  }

  export type ProjectUpsertWithoutTestsInput = {
    update: XOR<ProjectUpdateWithoutTestsInput, ProjectUncheckedUpdateWithoutTestsInput>
    create: XOR<ProjectCreateWithoutTestsInput, ProjectUncheckedCreateWithoutTestsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutTestsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutTestsInput, ProjectUncheckedUpdateWithoutTestsInput>
  }

  export type ProjectUpdateWithoutTestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    vertical?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: ProjectUpdatemodulesInput | string[]
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutProjectsNestedInput
    requirements?: RequirementUpdateManyWithoutProjectNestedInput
    risks?: RiskUpdateManyWithoutProjectNestedInput
    capas?: CAPAUpdateManyWithoutProjectNestedInput
    auditLogs?: AuditLogUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutTestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    vertical?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: ProjectUpdatemodulesInput | string[]
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements?: RequirementUncheckedUpdateManyWithoutProjectNestedInput
    risks?: RiskUncheckedUpdateManyWithoutProjectNestedInput
    capas?: CAPAUncheckedUpdateManyWithoutProjectNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateWithoutRisksInput = {
    id?: string
    name: string
    description?: string
    owner?: string
    version?: string
    country?: string
    vertical?: string | null
    modules?: ProjectCreatemodulesInput | string[]
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutProjectsInput
    requirements?: RequirementCreateNestedManyWithoutProjectInput
    tests?: TestCreateNestedManyWithoutProjectInput
    capas?: CAPACreateNestedManyWithoutProjectInput
    auditLogs?: AuditLogCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutRisksInput = {
    id?: string
    workspaceId: string
    name: string
    description?: string
    owner?: string
    version?: string
    country?: string
    vertical?: string | null
    modules?: ProjectCreatemodulesInput | string[]
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements?: RequirementUncheckedCreateNestedManyWithoutProjectInput
    tests?: TestUncheckedCreateNestedManyWithoutProjectInput
    capas?: CAPAUncheckedCreateNestedManyWithoutProjectInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutRisksInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutRisksInput, ProjectUncheckedCreateWithoutRisksInput>
  }

  export type ProjectUpsertWithoutRisksInput = {
    update: XOR<ProjectUpdateWithoutRisksInput, ProjectUncheckedUpdateWithoutRisksInput>
    create: XOR<ProjectCreateWithoutRisksInput, ProjectUncheckedCreateWithoutRisksInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutRisksInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutRisksInput, ProjectUncheckedUpdateWithoutRisksInput>
  }

  export type ProjectUpdateWithoutRisksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    vertical?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: ProjectUpdatemodulesInput | string[]
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutProjectsNestedInput
    requirements?: RequirementUpdateManyWithoutProjectNestedInput
    tests?: TestUpdateManyWithoutProjectNestedInput
    capas?: CAPAUpdateManyWithoutProjectNestedInput
    auditLogs?: AuditLogUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutRisksInput = {
    id?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    vertical?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: ProjectUpdatemodulesInput | string[]
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements?: RequirementUncheckedUpdateManyWithoutProjectNestedInput
    tests?: TestUncheckedUpdateManyWithoutProjectNestedInput
    capas?: CAPAUncheckedUpdateManyWithoutProjectNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateWithoutCapasInput = {
    id?: string
    name: string
    description?: string
    owner?: string
    version?: string
    country?: string
    vertical?: string | null
    modules?: ProjectCreatemodulesInput | string[]
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutProjectsInput
    requirements?: RequirementCreateNestedManyWithoutProjectInput
    tests?: TestCreateNestedManyWithoutProjectInput
    risks?: RiskCreateNestedManyWithoutProjectInput
    auditLogs?: AuditLogCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutCapasInput = {
    id?: string
    workspaceId: string
    name: string
    description?: string
    owner?: string
    version?: string
    country?: string
    vertical?: string | null
    modules?: ProjectCreatemodulesInput | string[]
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements?: RequirementUncheckedCreateNestedManyWithoutProjectInput
    tests?: TestUncheckedCreateNestedManyWithoutProjectInput
    risks?: RiskUncheckedCreateNestedManyWithoutProjectInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutCapasInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutCapasInput, ProjectUncheckedCreateWithoutCapasInput>
  }

  export type ProjectUpsertWithoutCapasInput = {
    update: XOR<ProjectUpdateWithoutCapasInput, ProjectUncheckedUpdateWithoutCapasInput>
    create: XOR<ProjectCreateWithoutCapasInput, ProjectUncheckedCreateWithoutCapasInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutCapasInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutCapasInput, ProjectUncheckedUpdateWithoutCapasInput>
  }

  export type ProjectUpdateWithoutCapasInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    vertical?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: ProjectUpdatemodulesInput | string[]
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutProjectsNestedInput
    requirements?: RequirementUpdateManyWithoutProjectNestedInput
    tests?: TestUpdateManyWithoutProjectNestedInput
    risks?: RiskUpdateManyWithoutProjectNestedInput
    auditLogs?: AuditLogUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutCapasInput = {
    id?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    vertical?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: ProjectUpdatemodulesInput | string[]
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements?: RequirementUncheckedUpdateManyWithoutProjectNestedInput
    tests?: TestUncheckedUpdateManyWithoutProjectNestedInput
    risks?: RiskUncheckedUpdateManyWithoutProjectNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateWithoutAuditLogsInput = {
    id?: string
    name: string
    description?: string
    owner?: string
    version?: string
    country?: string
    vertical?: string | null
    modules?: ProjectCreatemodulesInput | string[]
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutProjectsInput
    requirements?: RequirementCreateNestedManyWithoutProjectInput
    tests?: TestCreateNestedManyWithoutProjectInput
    risks?: RiskCreateNestedManyWithoutProjectInput
    capas?: CAPACreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    workspaceId: string
    name: string
    description?: string
    owner?: string
    version?: string
    country?: string
    vertical?: string | null
    modules?: ProjectCreatemodulesInput | string[]
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements?: RequirementUncheckedCreateNestedManyWithoutProjectInput
    tests?: TestUncheckedCreateNestedManyWithoutProjectInput
    risks?: RiskUncheckedCreateNestedManyWithoutProjectInput
    capas?: CAPAUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutAuditLogsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutAuditLogsInput, ProjectUncheckedCreateWithoutAuditLogsInput>
  }

  export type ProjectUpsertWithoutAuditLogsInput = {
    update: XOR<ProjectUpdateWithoutAuditLogsInput, ProjectUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<ProjectCreateWithoutAuditLogsInput, ProjectUncheckedCreateWithoutAuditLogsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutAuditLogsInput, ProjectUncheckedUpdateWithoutAuditLogsInput>
  }

  export type ProjectUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    vertical?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: ProjectUpdatemodulesInput | string[]
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutProjectsNestedInput
    requirements?: RequirementUpdateManyWithoutProjectNestedInput
    tests?: TestUpdateManyWithoutProjectNestedInput
    risks?: RiskUpdateManyWithoutProjectNestedInput
    capas?: CAPAUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    vertical?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: ProjectUpdatemodulesInput | string[]
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements?: RequirementUncheckedUpdateManyWithoutProjectNestedInput
    tests?: TestUncheckedUpdateManyWithoutProjectNestedInput
    risks?: RiskUncheckedUpdateManyWithoutProjectNestedInput
    capas?: CAPAUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type UserCreateManyOrgInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    role?: string
    createdAt?: Date | string
  }

  export type WorkspaceCreateManyOrgInput = {
    id?: string
    name: string
    createdAt?: Date | string
  }

  export type UserUpdateWithoutOrgInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutOrgInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyWithoutOrgInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceUpdateWithoutOrgInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutOrgInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateManyWithoutOrgInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateManyWorkspaceInput = {
    id?: string
    name: string
    description?: string
    owner?: string
    version?: string
    country?: string
    vertical?: string | null
    modules?: ProjectCreatemodulesInput | string[]
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    vertical?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: ProjectUpdatemodulesInput | string[]
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements?: RequirementUpdateManyWithoutProjectNestedInput
    tests?: TestUpdateManyWithoutProjectNestedInput
    risks?: RiskUpdateManyWithoutProjectNestedInput
    capas?: CAPAUpdateManyWithoutProjectNestedInput
    auditLogs?: AuditLogUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    vertical?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: ProjectUpdatemodulesInput | string[]
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements?: RequirementUncheckedUpdateManyWithoutProjectNestedInput
    tests?: TestUncheckedUpdateManyWithoutProjectNestedInput
    risks?: RiskUncheckedUpdateManyWithoutProjectNestedInput
    capas?: CAPAUncheckedUpdateManyWithoutProjectNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    vertical?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: ProjectUpdatemodulesInput | string[]
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequirementCreateManyProjectInput = {
    id?: string
    seqId: string
    title: string
    description?: string
    status?: string
    tags?: RequirementCreatetagsInput | string[]
    riskLevel?: string | null
    regulatoryRef?: string | null
    evidenceHints?: RequirementCreateevidenceHintsInput | string[]
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TestCreateManyProjectInput = {
    id?: string
    seqId: string
    title: string
    description?: string
    status?: string
    linkedRequirementIds?: TestCreatelinkedRequirementIdsInput | string[]
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RiskCreateManyProjectInput = {
    id?: string
    requirementId: string
    severity: number
    likelihood: number
    detectability?: number | null
    riskScore: number
    riskLevel: string
    mitigation?: string | null
    residualRisk?: number | null
    classifiedBy?: string
    createdAt?: Date | string
  }

  export type CAPACreateManyProjectInput = {
    id?: string
    title: string
    status?: string
    rootCause?: string | null
    containment?: string | null
    correctiveAction?: string | null
    preventiveAction?: string | null
    effectivenessCheck?: string | null
    linkedTestId?: string | null
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuditLogCreateManyProjectInput = {
    id?: string
    timestamp?: Date | string
    userId: string
    action: string
    entityType: string
    entityId: string
    previousValue?: NullableJsonNullValueInput | InputJsonValue
    newValue?: NullableJsonNullValueInput | InputJsonValue
    reason?: string | null
  }

  export type RequirementUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    seqId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    tags?: RequirementUpdatetagsInput | string[]
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    regulatoryRef?: NullableStringFieldUpdateOperationsInput | string | null
    evidenceHints?: RequirementUpdateevidenceHintsInput | string[]
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequirementUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    seqId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    tags?: RequirementUpdatetagsInput | string[]
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    regulatoryRef?: NullableStringFieldUpdateOperationsInput | string | null
    evidenceHints?: RequirementUpdateevidenceHintsInput | string[]
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequirementUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    seqId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    tags?: RequirementUpdatetagsInput | string[]
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    regulatoryRef?: NullableStringFieldUpdateOperationsInput | string | null
    evidenceHints?: RequirementUpdateevidenceHintsInput | string[]
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TestUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    seqId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    linkedRequirementIds?: TestUpdatelinkedRequirementIdsInput | string[]
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TestUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    seqId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    linkedRequirementIds?: TestUpdatelinkedRequirementIdsInput | string[]
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TestUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    seqId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    linkedRequirementIds?: TestUpdatelinkedRequirementIdsInput | string[]
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RiskUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    requirementId?: StringFieldUpdateOperationsInput | string
    severity?: IntFieldUpdateOperationsInput | number
    likelihood?: IntFieldUpdateOperationsInput | number
    detectability?: NullableIntFieldUpdateOperationsInput | number | null
    riskScore?: IntFieldUpdateOperationsInput | number
    riskLevel?: StringFieldUpdateOperationsInput | string
    mitigation?: NullableStringFieldUpdateOperationsInput | string | null
    residualRisk?: NullableIntFieldUpdateOperationsInput | number | null
    classifiedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RiskUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    requirementId?: StringFieldUpdateOperationsInput | string
    severity?: IntFieldUpdateOperationsInput | number
    likelihood?: IntFieldUpdateOperationsInput | number
    detectability?: NullableIntFieldUpdateOperationsInput | number | null
    riskScore?: IntFieldUpdateOperationsInput | number
    riskLevel?: StringFieldUpdateOperationsInput | string
    mitigation?: NullableStringFieldUpdateOperationsInput | string | null
    residualRisk?: NullableIntFieldUpdateOperationsInput | number | null
    classifiedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RiskUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    requirementId?: StringFieldUpdateOperationsInput | string
    severity?: IntFieldUpdateOperationsInput | number
    likelihood?: IntFieldUpdateOperationsInput | number
    detectability?: NullableIntFieldUpdateOperationsInput | number | null
    riskScore?: IntFieldUpdateOperationsInput | number
    riskLevel?: StringFieldUpdateOperationsInput | string
    mitigation?: NullableStringFieldUpdateOperationsInput | string | null
    residualRisk?: NullableIntFieldUpdateOperationsInput | number | null
    classifiedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CAPAUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    rootCause?: NullableStringFieldUpdateOperationsInput | string | null
    containment?: NullableStringFieldUpdateOperationsInput | string | null
    correctiveAction?: NullableStringFieldUpdateOperationsInput | string | null
    preventiveAction?: NullableStringFieldUpdateOperationsInput | string | null
    effectivenessCheck?: NullableStringFieldUpdateOperationsInput | string | null
    linkedTestId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CAPAUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    rootCause?: NullableStringFieldUpdateOperationsInput | string | null
    containment?: NullableStringFieldUpdateOperationsInput | string | null
    correctiveAction?: NullableStringFieldUpdateOperationsInput | string | null
    preventiveAction?: NullableStringFieldUpdateOperationsInput | string | null
    effectivenessCheck?: NullableStringFieldUpdateOperationsInput | string | null
    linkedTestId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CAPAUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    rootCause?: NullableStringFieldUpdateOperationsInput | string | null
    containment?: NullableStringFieldUpdateOperationsInput | string | null
    correctiveAction?: NullableStringFieldUpdateOperationsInput | string | null
    preventiveAction?: NullableStringFieldUpdateOperationsInput | string | null
    effectivenessCheck?: NullableStringFieldUpdateOperationsInput | string | null
    linkedTestId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    previousValue?: NullableJsonNullValueInput | InputJsonValue
    newValue?: NullableJsonNullValueInput | InputJsonValue
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuditLogUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    previousValue?: NullableJsonNullValueInput | InputJsonValue
    newValue?: NullableJsonNullValueInput | InputJsonValue
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuditLogUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    previousValue?: NullableJsonNullValueInput | InputJsonValue
    newValue?: NullableJsonNullValueInput | InputJsonValue
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}