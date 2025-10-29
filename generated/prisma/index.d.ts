
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model SharedAccess
 * 
 */
export type SharedAccess = $Result.DefaultSelection<Prisma.$SharedAccessPayload>
/**
 * Model AccessRequest
 * 
 */
export type AccessRequest = $Result.DefaultSelection<Prisma.$AccessRequestPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more SharedAccesses
 * const sharedAccesses = await prisma.sharedAccess.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
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
   * const prisma = new PrismaClient()
   * // Fetch zero or more SharedAccesses
   * const sharedAccesses = await prisma.sharedAccess.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.sharedAccess`: Exposes CRUD operations for the **SharedAccess** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SharedAccesses
    * const sharedAccesses = await prisma.sharedAccess.findMany()
    * ```
    */
  get sharedAccess(): Prisma.SharedAccessDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.accessRequest`: Exposes CRUD operations for the **AccessRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AccessRequests
    * const accessRequests = await prisma.accessRequest.findMany()
    * ```
    */
  get accessRequest(): Prisma.AccessRequestDelegate<ExtArgs, ClientOptions>;
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
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

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
   * Prisma Client JS version: 6.18.0
   * Query Engine version: 34b5a692b7bd79939a9a2c3ef97d816e749cda2f
   */
  export type PrismaVersion = {
    client: string
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
    SharedAccess: 'SharedAccess',
    AccessRequest: 'AccessRequest'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "sharedAccess" | "accessRequest"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      SharedAccess: {
        payload: Prisma.$SharedAccessPayload<ExtArgs>
        fields: Prisma.SharedAccessFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SharedAccessFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAccessPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SharedAccessFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAccessPayload>
          }
          findFirst: {
            args: Prisma.SharedAccessFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAccessPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SharedAccessFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAccessPayload>
          }
          findMany: {
            args: Prisma.SharedAccessFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAccessPayload>[]
          }
          create: {
            args: Prisma.SharedAccessCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAccessPayload>
          }
          createMany: {
            args: Prisma.SharedAccessCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SharedAccessCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAccessPayload>[]
          }
          delete: {
            args: Prisma.SharedAccessDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAccessPayload>
          }
          update: {
            args: Prisma.SharedAccessUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAccessPayload>
          }
          deleteMany: {
            args: Prisma.SharedAccessDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SharedAccessUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SharedAccessUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAccessPayload>[]
          }
          upsert: {
            args: Prisma.SharedAccessUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAccessPayload>
          }
          aggregate: {
            args: Prisma.SharedAccessAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSharedAccess>
          }
          groupBy: {
            args: Prisma.SharedAccessGroupByArgs<ExtArgs>
            result: $Utils.Optional<SharedAccessGroupByOutputType>[]
          }
          count: {
            args: Prisma.SharedAccessCountArgs<ExtArgs>
            result: $Utils.Optional<SharedAccessCountAggregateOutputType> | number
          }
        }
      }
      AccessRequest: {
        payload: Prisma.$AccessRequestPayload<ExtArgs>
        fields: Prisma.AccessRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccessRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccessRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessRequestPayload>
          }
          findFirst: {
            args: Prisma.AccessRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccessRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessRequestPayload>
          }
          findMany: {
            args: Prisma.AccessRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessRequestPayload>[]
          }
          create: {
            args: Prisma.AccessRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessRequestPayload>
          }
          createMany: {
            args: Prisma.AccessRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccessRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessRequestPayload>[]
          }
          delete: {
            args: Prisma.AccessRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessRequestPayload>
          }
          update: {
            args: Prisma.AccessRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessRequestPayload>
          }
          deleteMany: {
            args: Prisma.AccessRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccessRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccessRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessRequestPayload>[]
          }
          upsert: {
            args: Prisma.AccessRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessRequestPayload>
          }
          aggregate: {
            args: Prisma.AccessRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccessRequest>
          }
          groupBy: {
            args: Prisma.AccessRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccessRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccessRequestCountArgs<ExtArgs>
            result: $Utils.Optional<AccessRequestCountAggregateOutputType> | number
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
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
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
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
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
    adapter?: runtime.SqlDriverAdapterFactory | null
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
  }
  export type GlobalOmitConfig = {
    sharedAccess?: SharedAccessOmit
    accessRequest?: AccessRequestOmit
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
   * Models
   */

  /**
   * Model SharedAccess
   */

  export type AggregateSharedAccess = {
    _count: SharedAccessCountAggregateOutputType | null
    _min: SharedAccessMinAggregateOutputType | null
    _max: SharedAccessMaxAggregateOutputType | null
  }

  export type SharedAccessMinAggregateOutputType = {
    id: string | null
    ownerWallet: string | null
    viewerWallet: string | null
    mintAddress: string | null
    status: string | null
    createdAt: Date | null
  }

  export type SharedAccessMaxAggregateOutputType = {
    id: string | null
    ownerWallet: string | null
    viewerWallet: string | null
    mintAddress: string | null
    status: string | null
    createdAt: Date | null
  }

  export type SharedAccessCountAggregateOutputType = {
    id: number
    ownerWallet: number
    viewerWallet: number
    mintAddress: number
    status: number
    createdAt: number
    _all: number
  }


  export type SharedAccessMinAggregateInputType = {
    id?: true
    ownerWallet?: true
    viewerWallet?: true
    mintAddress?: true
    status?: true
    createdAt?: true
  }

  export type SharedAccessMaxAggregateInputType = {
    id?: true
    ownerWallet?: true
    viewerWallet?: true
    mintAddress?: true
    status?: true
    createdAt?: true
  }

  export type SharedAccessCountAggregateInputType = {
    id?: true
    ownerWallet?: true
    viewerWallet?: true
    mintAddress?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type SharedAccessAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SharedAccess to aggregate.
     */
    where?: SharedAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SharedAccesses to fetch.
     */
    orderBy?: SharedAccessOrderByWithRelationInput | SharedAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SharedAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SharedAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SharedAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SharedAccesses
    **/
    _count?: true | SharedAccessCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SharedAccessMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SharedAccessMaxAggregateInputType
  }

  export type GetSharedAccessAggregateType<T extends SharedAccessAggregateArgs> = {
        [P in keyof T & keyof AggregateSharedAccess]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSharedAccess[P]>
      : GetScalarType<T[P], AggregateSharedAccess[P]>
  }




  export type SharedAccessGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SharedAccessWhereInput
    orderBy?: SharedAccessOrderByWithAggregationInput | SharedAccessOrderByWithAggregationInput[]
    by: SharedAccessScalarFieldEnum[] | SharedAccessScalarFieldEnum
    having?: SharedAccessScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SharedAccessCountAggregateInputType | true
    _min?: SharedAccessMinAggregateInputType
    _max?: SharedAccessMaxAggregateInputType
  }

  export type SharedAccessGroupByOutputType = {
    id: string
    ownerWallet: string
    viewerWallet: string
    mintAddress: string
    status: string
    createdAt: Date
    _count: SharedAccessCountAggregateOutputType | null
    _min: SharedAccessMinAggregateOutputType | null
    _max: SharedAccessMaxAggregateOutputType | null
  }

  type GetSharedAccessGroupByPayload<T extends SharedAccessGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SharedAccessGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SharedAccessGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SharedAccessGroupByOutputType[P]>
            : GetScalarType<T[P], SharedAccessGroupByOutputType[P]>
        }
      >
    >


  export type SharedAccessSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerWallet?: boolean
    viewerWallet?: boolean
    mintAddress?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["sharedAccess"]>

  export type SharedAccessSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerWallet?: boolean
    viewerWallet?: boolean
    mintAddress?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["sharedAccess"]>

  export type SharedAccessSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerWallet?: boolean
    viewerWallet?: boolean
    mintAddress?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["sharedAccess"]>

  export type SharedAccessSelectScalar = {
    id?: boolean
    ownerWallet?: boolean
    viewerWallet?: boolean
    mintAddress?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type SharedAccessOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ownerWallet" | "viewerWallet" | "mintAddress" | "status" | "createdAt", ExtArgs["result"]["sharedAccess"]>

  export type $SharedAccessPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SharedAccess"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ownerWallet: string
      viewerWallet: string
      mintAddress: string
      status: string
      createdAt: Date
    }, ExtArgs["result"]["sharedAccess"]>
    composites: {}
  }

  type SharedAccessGetPayload<S extends boolean | null | undefined | SharedAccessDefaultArgs> = $Result.GetResult<Prisma.$SharedAccessPayload, S>

  type SharedAccessCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SharedAccessFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SharedAccessCountAggregateInputType | true
    }

  export interface SharedAccessDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SharedAccess'], meta: { name: 'SharedAccess' } }
    /**
     * Find zero or one SharedAccess that matches the filter.
     * @param {SharedAccessFindUniqueArgs} args - Arguments to find a SharedAccess
     * @example
     * // Get one SharedAccess
     * const sharedAccess = await prisma.sharedAccess.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SharedAccessFindUniqueArgs>(args: SelectSubset<T, SharedAccessFindUniqueArgs<ExtArgs>>): Prisma__SharedAccessClient<$Result.GetResult<Prisma.$SharedAccessPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SharedAccess that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SharedAccessFindUniqueOrThrowArgs} args - Arguments to find a SharedAccess
     * @example
     * // Get one SharedAccess
     * const sharedAccess = await prisma.sharedAccess.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SharedAccessFindUniqueOrThrowArgs>(args: SelectSubset<T, SharedAccessFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SharedAccessClient<$Result.GetResult<Prisma.$SharedAccessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SharedAccess that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedAccessFindFirstArgs} args - Arguments to find a SharedAccess
     * @example
     * // Get one SharedAccess
     * const sharedAccess = await prisma.sharedAccess.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SharedAccessFindFirstArgs>(args?: SelectSubset<T, SharedAccessFindFirstArgs<ExtArgs>>): Prisma__SharedAccessClient<$Result.GetResult<Prisma.$SharedAccessPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SharedAccess that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedAccessFindFirstOrThrowArgs} args - Arguments to find a SharedAccess
     * @example
     * // Get one SharedAccess
     * const sharedAccess = await prisma.sharedAccess.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SharedAccessFindFirstOrThrowArgs>(args?: SelectSubset<T, SharedAccessFindFirstOrThrowArgs<ExtArgs>>): Prisma__SharedAccessClient<$Result.GetResult<Prisma.$SharedAccessPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SharedAccesses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedAccessFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SharedAccesses
     * const sharedAccesses = await prisma.sharedAccess.findMany()
     * 
     * // Get first 10 SharedAccesses
     * const sharedAccesses = await prisma.sharedAccess.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sharedAccessWithIdOnly = await prisma.sharedAccess.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SharedAccessFindManyArgs>(args?: SelectSubset<T, SharedAccessFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SharedAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SharedAccess.
     * @param {SharedAccessCreateArgs} args - Arguments to create a SharedAccess.
     * @example
     * // Create one SharedAccess
     * const SharedAccess = await prisma.sharedAccess.create({
     *   data: {
     *     // ... data to create a SharedAccess
     *   }
     * })
     * 
     */
    create<T extends SharedAccessCreateArgs>(args: SelectSubset<T, SharedAccessCreateArgs<ExtArgs>>): Prisma__SharedAccessClient<$Result.GetResult<Prisma.$SharedAccessPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SharedAccesses.
     * @param {SharedAccessCreateManyArgs} args - Arguments to create many SharedAccesses.
     * @example
     * // Create many SharedAccesses
     * const sharedAccess = await prisma.sharedAccess.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SharedAccessCreateManyArgs>(args?: SelectSubset<T, SharedAccessCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SharedAccesses and returns the data saved in the database.
     * @param {SharedAccessCreateManyAndReturnArgs} args - Arguments to create many SharedAccesses.
     * @example
     * // Create many SharedAccesses
     * const sharedAccess = await prisma.sharedAccess.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SharedAccesses and only return the `id`
     * const sharedAccessWithIdOnly = await prisma.sharedAccess.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SharedAccessCreateManyAndReturnArgs>(args?: SelectSubset<T, SharedAccessCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SharedAccessPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SharedAccess.
     * @param {SharedAccessDeleteArgs} args - Arguments to delete one SharedAccess.
     * @example
     * // Delete one SharedAccess
     * const SharedAccess = await prisma.sharedAccess.delete({
     *   where: {
     *     // ... filter to delete one SharedAccess
     *   }
     * })
     * 
     */
    delete<T extends SharedAccessDeleteArgs>(args: SelectSubset<T, SharedAccessDeleteArgs<ExtArgs>>): Prisma__SharedAccessClient<$Result.GetResult<Prisma.$SharedAccessPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SharedAccess.
     * @param {SharedAccessUpdateArgs} args - Arguments to update one SharedAccess.
     * @example
     * // Update one SharedAccess
     * const sharedAccess = await prisma.sharedAccess.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SharedAccessUpdateArgs>(args: SelectSubset<T, SharedAccessUpdateArgs<ExtArgs>>): Prisma__SharedAccessClient<$Result.GetResult<Prisma.$SharedAccessPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SharedAccesses.
     * @param {SharedAccessDeleteManyArgs} args - Arguments to filter SharedAccesses to delete.
     * @example
     * // Delete a few SharedAccesses
     * const { count } = await prisma.sharedAccess.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SharedAccessDeleteManyArgs>(args?: SelectSubset<T, SharedAccessDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SharedAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedAccessUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SharedAccesses
     * const sharedAccess = await prisma.sharedAccess.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SharedAccessUpdateManyArgs>(args: SelectSubset<T, SharedAccessUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SharedAccesses and returns the data updated in the database.
     * @param {SharedAccessUpdateManyAndReturnArgs} args - Arguments to update many SharedAccesses.
     * @example
     * // Update many SharedAccesses
     * const sharedAccess = await prisma.sharedAccess.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SharedAccesses and only return the `id`
     * const sharedAccessWithIdOnly = await prisma.sharedAccess.updateManyAndReturn({
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
    updateManyAndReturn<T extends SharedAccessUpdateManyAndReturnArgs>(args: SelectSubset<T, SharedAccessUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SharedAccessPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SharedAccess.
     * @param {SharedAccessUpsertArgs} args - Arguments to update or create a SharedAccess.
     * @example
     * // Update or create a SharedAccess
     * const sharedAccess = await prisma.sharedAccess.upsert({
     *   create: {
     *     // ... data to create a SharedAccess
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SharedAccess we want to update
     *   }
     * })
     */
    upsert<T extends SharedAccessUpsertArgs>(args: SelectSubset<T, SharedAccessUpsertArgs<ExtArgs>>): Prisma__SharedAccessClient<$Result.GetResult<Prisma.$SharedAccessPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SharedAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedAccessCountArgs} args - Arguments to filter SharedAccesses to count.
     * @example
     * // Count the number of SharedAccesses
     * const count = await prisma.sharedAccess.count({
     *   where: {
     *     // ... the filter for the SharedAccesses we want to count
     *   }
     * })
    **/
    count<T extends SharedAccessCountArgs>(
      args?: Subset<T, SharedAccessCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SharedAccessCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SharedAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedAccessAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SharedAccessAggregateArgs>(args: Subset<T, SharedAccessAggregateArgs>): Prisma.PrismaPromise<GetSharedAccessAggregateType<T>>

    /**
     * Group by SharedAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedAccessGroupByArgs} args - Group by arguments.
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
      T extends SharedAccessGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SharedAccessGroupByArgs['orderBy'] }
        : { orderBy?: SharedAccessGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SharedAccessGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSharedAccessGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SharedAccess model
   */
  readonly fields: SharedAccessFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SharedAccess.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SharedAccessClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the SharedAccess model
   */
  interface SharedAccessFieldRefs {
    readonly id: FieldRef<"SharedAccess", 'String'>
    readonly ownerWallet: FieldRef<"SharedAccess", 'String'>
    readonly viewerWallet: FieldRef<"SharedAccess", 'String'>
    readonly mintAddress: FieldRef<"SharedAccess", 'String'>
    readonly status: FieldRef<"SharedAccess", 'String'>
    readonly createdAt: FieldRef<"SharedAccess", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SharedAccess findUnique
   */
  export type SharedAccessFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAccess
     */
    select?: SharedAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAccess
     */
    omit?: SharedAccessOmit<ExtArgs> | null
    /**
     * Filter, which SharedAccess to fetch.
     */
    where: SharedAccessWhereUniqueInput
  }

  /**
   * SharedAccess findUniqueOrThrow
   */
  export type SharedAccessFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAccess
     */
    select?: SharedAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAccess
     */
    omit?: SharedAccessOmit<ExtArgs> | null
    /**
     * Filter, which SharedAccess to fetch.
     */
    where: SharedAccessWhereUniqueInput
  }

  /**
   * SharedAccess findFirst
   */
  export type SharedAccessFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAccess
     */
    select?: SharedAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAccess
     */
    omit?: SharedAccessOmit<ExtArgs> | null
    /**
     * Filter, which SharedAccess to fetch.
     */
    where?: SharedAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SharedAccesses to fetch.
     */
    orderBy?: SharedAccessOrderByWithRelationInput | SharedAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SharedAccesses.
     */
    cursor?: SharedAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SharedAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SharedAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SharedAccesses.
     */
    distinct?: SharedAccessScalarFieldEnum | SharedAccessScalarFieldEnum[]
  }

  /**
   * SharedAccess findFirstOrThrow
   */
  export type SharedAccessFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAccess
     */
    select?: SharedAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAccess
     */
    omit?: SharedAccessOmit<ExtArgs> | null
    /**
     * Filter, which SharedAccess to fetch.
     */
    where?: SharedAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SharedAccesses to fetch.
     */
    orderBy?: SharedAccessOrderByWithRelationInput | SharedAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SharedAccesses.
     */
    cursor?: SharedAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SharedAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SharedAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SharedAccesses.
     */
    distinct?: SharedAccessScalarFieldEnum | SharedAccessScalarFieldEnum[]
  }

  /**
   * SharedAccess findMany
   */
  export type SharedAccessFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAccess
     */
    select?: SharedAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAccess
     */
    omit?: SharedAccessOmit<ExtArgs> | null
    /**
     * Filter, which SharedAccesses to fetch.
     */
    where?: SharedAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SharedAccesses to fetch.
     */
    orderBy?: SharedAccessOrderByWithRelationInput | SharedAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SharedAccesses.
     */
    cursor?: SharedAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SharedAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SharedAccesses.
     */
    skip?: number
    distinct?: SharedAccessScalarFieldEnum | SharedAccessScalarFieldEnum[]
  }

  /**
   * SharedAccess create
   */
  export type SharedAccessCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAccess
     */
    select?: SharedAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAccess
     */
    omit?: SharedAccessOmit<ExtArgs> | null
    /**
     * The data needed to create a SharedAccess.
     */
    data: XOR<SharedAccessCreateInput, SharedAccessUncheckedCreateInput>
  }

  /**
   * SharedAccess createMany
   */
  export type SharedAccessCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SharedAccesses.
     */
    data: SharedAccessCreateManyInput | SharedAccessCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SharedAccess createManyAndReturn
   */
  export type SharedAccessCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAccess
     */
    select?: SharedAccessSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAccess
     */
    omit?: SharedAccessOmit<ExtArgs> | null
    /**
     * The data used to create many SharedAccesses.
     */
    data: SharedAccessCreateManyInput | SharedAccessCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SharedAccess update
   */
  export type SharedAccessUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAccess
     */
    select?: SharedAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAccess
     */
    omit?: SharedAccessOmit<ExtArgs> | null
    /**
     * The data needed to update a SharedAccess.
     */
    data: XOR<SharedAccessUpdateInput, SharedAccessUncheckedUpdateInput>
    /**
     * Choose, which SharedAccess to update.
     */
    where: SharedAccessWhereUniqueInput
  }

  /**
   * SharedAccess updateMany
   */
  export type SharedAccessUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SharedAccesses.
     */
    data: XOR<SharedAccessUpdateManyMutationInput, SharedAccessUncheckedUpdateManyInput>
    /**
     * Filter which SharedAccesses to update
     */
    where?: SharedAccessWhereInput
    /**
     * Limit how many SharedAccesses to update.
     */
    limit?: number
  }

  /**
   * SharedAccess updateManyAndReturn
   */
  export type SharedAccessUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAccess
     */
    select?: SharedAccessSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAccess
     */
    omit?: SharedAccessOmit<ExtArgs> | null
    /**
     * The data used to update SharedAccesses.
     */
    data: XOR<SharedAccessUpdateManyMutationInput, SharedAccessUncheckedUpdateManyInput>
    /**
     * Filter which SharedAccesses to update
     */
    where?: SharedAccessWhereInput
    /**
     * Limit how many SharedAccesses to update.
     */
    limit?: number
  }

  /**
   * SharedAccess upsert
   */
  export type SharedAccessUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAccess
     */
    select?: SharedAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAccess
     */
    omit?: SharedAccessOmit<ExtArgs> | null
    /**
     * The filter to search for the SharedAccess to update in case it exists.
     */
    where: SharedAccessWhereUniqueInput
    /**
     * In case the SharedAccess found by the `where` argument doesn't exist, create a new SharedAccess with this data.
     */
    create: XOR<SharedAccessCreateInput, SharedAccessUncheckedCreateInput>
    /**
     * In case the SharedAccess was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SharedAccessUpdateInput, SharedAccessUncheckedUpdateInput>
  }

  /**
   * SharedAccess delete
   */
  export type SharedAccessDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAccess
     */
    select?: SharedAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAccess
     */
    omit?: SharedAccessOmit<ExtArgs> | null
    /**
     * Filter which SharedAccess to delete.
     */
    where: SharedAccessWhereUniqueInput
  }

  /**
   * SharedAccess deleteMany
   */
  export type SharedAccessDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SharedAccesses to delete
     */
    where?: SharedAccessWhereInput
    /**
     * Limit how many SharedAccesses to delete.
     */
    limit?: number
  }

  /**
   * SharedAccess without action
   */
  export type SharedAccessDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAccess
     */
    select?: SharedAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAccess
     */
    omit?: SharedAccessOmit<ExtArgs> | null
  }


  /**
   * Model AccessRequest
   */

  export type AggregateAccessRequest = {
    _count: AccessRequestCountAggregateOutputType | null
    _min: AccessRequestMinAggregateOutputType | null
    _max: AccessRequestMaxAggregateOutputType | null
  }

  export type AccessRequestMinAggregateOutputType = {
    id: string | null
    requesterWallet: string | null
    ownerWallet: string | null
    mintAddress: string | null
    nftName: string | null
    message: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccessRequestMaxAggregateOutputType = {
    id: string | null
    requesterWallet: string | null
    ownerWallet: string | null
    mintAddress: string | null
    nftName: string | null
    message: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccessRequestCountAggregateOutputType = {
    id: number
    requesterWallet: number
    ownerWallet: number
    mintAddress: number
    nftName: number
    message: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccessRequestMinAggregateInputType = {
    id?: true
    requesterWallet?: true
    ownerWallet?: true
    mintAddress?: true
    nftName?: true
    message?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccessRequestMaxAggregateInputType = {
    id?: true
    requesterWallet?: true
    ownerWallet?: true
    mintAddress?: true
    nftName?: true
    message?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccessRequestCountAggregateInputType = {
    id?: true
    requesterWallet?: true
    ownerWallet?: true
    mintAddress?: true
    nftName?: true
    message?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccessRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccessRequest to aggregate.
     */
    where?: AccessRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccessRequests to fetch.
     */
    orderBy?: AccessRequestOrderByWithRelationInput | AccessRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccessRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccessRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccessRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AccessRequests
    **/
    _count?: true | AccessRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccessRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccessRequestMaxAggregateInputType
  }

  export type GetAccessRequestAggregateType<T extends AccessRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateAccessRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccessRequest[P]>
      : GetScalarType<T[P], AggregateAccessRequest[P]>
  }




  export type AccessRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccessRequestWhereInput
    orderBy?: AccessRequestOrderByWithAggregationInput | AccessRequestOrderByWithAggregationInput[]
    by: AccessRequestScalarFieldEnum[] | AccessRequestScalarFieldEnum
    having?: AccessRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccessRequestCountAggregateInputType | true
    _min?: AccessRequestMinAggregateInputType
    _max?: AccessRequestMaxAggregateInputType
  }

  export type AccessRequestGroupByOutputType = {
    id: string
    requesterWallet: string
    ownerWallet: string
    mintAddress: string
    nftName: string | null
    message: string | null
    status: string
    createdAt: Date
    updatedAt: Date
    _count: AccessRequestCountAggregateOutputType | null
    _min: AccessRequestMinAggregateOutputType | null
    _max: AccessRequestMaxAggregateOutputType | null
  }

  type GetAccessRequestGroupByPayload<T extends AccessRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccessRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccessRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccessRequestGroupByOutputType[P]>
            : GetScalarType<T[P], AccessRequestGroupByOutputType[P]>
        }
      >
    >


  export type AccessRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterWallet?: boolean
    ownerWallet?: boolean
    mintAddress?: boolean
    nftName?: boolean
    message?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["accessRequest"]>

  export type AccessRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterWallet?: boolean
    ownerWallet?: boolean
    mintAddress?: boolean
    nftName?: boolean
    message?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["accessRequest"]>

  export type AccessRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterWallet?: boolean
    ownerWallet?: boolean
    mintAddress?: boolean
    nftName?: boolean
    message?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["accessRequest"]>

  export type AccessRequestSelectScalar = {
    id?: boolean
    requesterWallet?: boolean
    ownerWallet?: boolean
    mintAddress?: boolean
    nftName?: boolean
    message?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccessRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "requesterWallet" | "ownerWallet" | "mintAddress" | "nftName" | "message" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["accessRequest"]>

  export type $AccessRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AccessRequest"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      requesterWallet: string
      ownerWallet: string
      mintAddress: string
      nftName: string | null
      message: string | null
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["accessRequest"]>
    composites: {}
  }

  type AccessRequestGetPayload<S extends boolean | null | undefined | AccessRequestDefaultArgs> = $Result.GetResult<Prisma.$AccessRequestPayload, S>

  type AccessRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccessRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccessRequestCountAggregateInputType | true
    }

  export interface AccessRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AccessRequest'], meta: { name: 'AccessRequest' } }
    /**
     * Find zero or one AccessRequest that matches the filter.
     * @param {AccessRequestFindUniqueArgs} args - Arguments to find a AccessRequest
     * @example
     * // Get one AccessRequest
     * const accessRequest = await prisma.accessRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccessRequestFindUniqueArgs>(args: SelectSubset<T, AccessRequestFindUniqueArgs<ExtArgs>>): Prisma__AccessRequestClient<$Result.GetResult<Prisma.$AccessRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AccessRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccessRequestFindUniqueOrThrowArgs} args - Arguments to find a AccessRequest
     * @example
     * // Get one AccessRequest
     * const accessRequest = await prisma.accessRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccessRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, AccessRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccessRequestClient<$Result.GetResult<Prisma.$AccessRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AccessRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessRequestFindFirstArgs} args - Arguments to find a AccessRequest
     * @example
     * // Get one AccessRequest
     * const accessRequest = await prisma.accessRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccessRequestFindFirstArgs>(args?: SelectSubset<T, AccessRequestFindFirstArgs<ExtArgs>>): Prisma__AccessRequestClient<$Result.GetResult<Prisma.$AccessRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AccessRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessRequestFindFirstOrThrowArgs} args - Arguments to find a AccessRequest
     * @example
     * // Get one AccessRequest
     * const accessRequest = await prisma.accessRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccessRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, AccessRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccessRequestClient<$Result.GetResult<Prisma.$AccessRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AccessRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AccessRequests
     * const accessRequests = await prisma.accessRequest.findMany()
     * 
     * // Get first 10 AccessRequests
     * const accessRequests = await prisma.accessRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accessRequestWithIdOnly = await prisma.accessRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccessRequestFindManyArgs>(args?: SelectSubset<T, AccessRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccessRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AccessRequest.
     * @param {AccessRequestCreateArgs} args - Arguments to create a AccessRequest.
     * @example
     * // Create one AccessRequest
     * const AccessRequest = await prisma.accessRequest.create({
     *   data: {
     *     // ... data to create a AccessRequest
     *   }
     * })
     * 
     */
    create<T extends AccessRequestCreateArgs>(args: SelectSubset<T, AccessRequestCreateArgs<ExtArgs>>): Prisma__AccessRequestClient<$Result.GetResult<Prisma.$AccessRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AccessRequests.
     * @param {AccessRequestCreateManyArgs} args - Arguments to create many AccessRequests.
     * @example
     * // Create many AccessRequests
     * const accessRequest = await prisma.accessRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccessRequestCreateManyArgs>(args?: SelectSubset<T, AccessRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AccessRequests and returns the data saved in the database.
     * @param {AccessRequestCreateManyAndReturnArgs} args - Arguments to create many AccessRequests.
     * @example
     * // Create many AccessRequests
     * const accessRequest = await prisma.accessRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AccessRequests and only return the `id`
     * const accessRequestWithIdOnly = await prisma.accessRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccessRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, AccessRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccessRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AccessRequest.
     * @param {AccessRequestDeleteArgs} args - Arguments to delete one AccessRequest.
     * @example
     * // Delete one AccessRequest
     * const AccessRequest = await prisma.accessRequest.delete({
     *   where: {
     *     // ... filter to delete one AccessRequest
     *   }
     * })
     * 
     */
    delete<T extends AccessRequestDeleteArgs>(args: SelectSubset<T, AccessRequestDeleteArgs<ExtArgs>>): Prisma__AccessRequestClient<$Result.GetResult<Prisma.$AccessRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AccessRequest.
     * @param {AccessRequestUpdateArgs} args - Arguments to update one AccessRequest.
     * @example
     * // Update one AccessRequest
     * const accessRequest = await prisma.accessRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccessRequestUpdateArgs>(args: SelectSubset<T, AccessRequestUpdateArgs<ExtArgs>>): Prisma__AccessRequestClient<$Result.GetResult<Prisma.$AccessRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AccessRequests.
     * @param {AccessRequestDeleteManyArgs} args - Arguments to filter AccessRequests to delete.
     * @example
     * // Delete a few AccessRequests
     * const { count } = await prisma.accessRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccessRequestDeleteManyArgs>(args?: SelectSubset<T, AccessRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AccessRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AccessRequests
     * const accessRequest = await prisma.accessRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccessRequestUpdateManyArgs>(args: SelectSubset<T, AccessRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AccessRequests and returns the data updated in the database.
     * @param {AccessRequestUpdateManyAndReturnArgs} args - Arguments to update many AccessRequests.
     * @example
     * // Update many AccessRequests
     * const accessRequest = await prisma.accessRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AccessRequests and only return the `id`
     * const accessRequestWithIdOnly = await prisma.accessRequest.updateManyAndReturn({
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
    updateManyAndReturn<T extends AccessRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, AccessRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccessRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AccessRequest.
     * @param {AccessRequestUpsertArgs} args - Arguments to update or create a AccessRequest.
     * @example
     * // Update or create a AccessRequest
     * const accessRequest = await prisma.accessRequest.upsert({
     *   create: {
     *     // ... data to create a AccessRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AccessRequest we want to update
     *   }
     * })
     */
    upsert<T extends AccessRequestUpsertArgs>(args: SelectSubset<T, AccessRequestUpsertArgs<ExtArgs>>): Prisma__AccessRequestClient<$Result.GetResult<Prisma.$AccessRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AccessRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessRequestCountArgs} args - Arguments to filter AccessRequests to count.
     * @example
     * // Count the number of AccessRequests
     * const count = await prisma.accessRequest.count({
     *   where: {
     *     // ... the filter for the AccessRequests we want to count
     *   }
     * })
    **/
    count<T extends AccessRequestCountArgs>(
      args?: Subset<T, AccessRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccessRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AccessRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AccessRequestAggregateArgs>(args: Subset<T, AccessRequestAggregateArgs>): Prisma.PrismaPromise<GetAccessRequestAggregateType<T>>

    /**
     * Group by AccessRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessRequestGroupByArgs} args - Group by arguments.
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
      T extends AccessRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccessRequestGroupByArgs['orderBy'] }
        : { orderBy?: AccessRequestGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AccessRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccessRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AccessRequest model
   */
  readonly fields: AccessRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AccessRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccessRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the AccessRequest model
   */
  interface AccessRequestFieldRefs {
    readonly id: FieldRef<"AccessRequest", 'String'>
    readonly requesterWallet: FieldRef<"AccessRequest", 'String'>
    readonly ownerWallet: FieldRef<"AccessRequest", 'String'>
    readonly mintAddress: FieldRef<"AccessRequest", 'String'>
    readonly nftName: FieldRef<"AccessRequest", 'String'>
    readonly message: FieldRef<"AccessRequest", 'String'>
    readonly status: FieldRef<"AccessRequest", 'String'>
    readonly createdAt: FieldRef<"AccessRequest", 'DateTime'>
    readonly updatedAt: FieldRef<"AccessRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AccessRequest findUnique
   */
  export type AccessRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessRequest
     */
    select?: AccessRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessRequest
     */
    omit?: AccessRequestOmit<ExtArgs> | null
    /**
     * Filter, which AccessRequest to fetch.
     */
    where: AccessRequestWhereUniqueInput
  }

  /**
   * AccessRequest findUniqueOrThrow
   */
  export type AccessRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessRequest
     */
    select?: AccessRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessRequest
     */
    omit?: AccessRequestOmit<ExtArgs> | null
    /**
     * Filter, which AccessRequest to fetch.
     */
    where: AccessRequestWhereUniqueInput
  }

  /**
   * AccessRequest findFirst
   */
  export type AccessRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessRequest
     */
    select?: AccessRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessRequest
     */
    omit?: AccessRequestOmit<ExtArgs> | null
    /**
     * Filter, which AccessRequest to fetch.
     */
    where?: AccessRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccessRequests to fetch.
     */
    orderBy?: AccessRequestOrderByWithRelationInput | AccessRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AccessRequests.
     */
    cursor?: AccessRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccessRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccessRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccessRequests.
     */
    distinct?: AccessRequestScalarFieldEnum | AccessRequestScalarFieldEnum[]
  }

  /**
   * AccessRequest findFirstOrThrow
   */
  export type AccessRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessRequest
     */
    select?: AccessRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessRequest
     */
    omit?: AccessRequestOmit<ExtArgs> | null
    /**
     * Filter, which AccessRequest to fetch.
     */
    where?: AccessRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccessRequests to fetch.
     */
    orderBy?: AccessRequestOrderByWithRelationInput | AccessRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AccessRequests.
     */
    cursor?: AccessRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccessRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccessRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccessRequests.
     */
    distinct?: AccessRequestScalarFieldEnum | AccessRequestScalarFieldEnum[]
  }

  /**
   * AccessRequest findMany
   */
  export type AccessRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessRequest
     */
    select?: AccessRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessRequest
     */
    omit?: AccessRequestOmit<ExtArgs> | null
    /**
     * Filter, which AccessRequests to fetch.
     */
    where?: AccessRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccessRequests to fetch.
     */
    orderBy?: AccessRequestOrderByWithRelationInput | AccessRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AccessRequests.
     */
    cursor?: AccessRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccessRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccessRequests.
     */
    skip?: number
    distinct?: AccessRequestScalarFieldEnum | AccessRequestScalarFieldEnum[]
  }

  /**
   * AccessRequest create
   */
  export type AccessRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessRequest
     */
    select?: AccessRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessRequest
     */
    omit?: AccessRequestOmit<ExtArgs> | null
    /**
     * The data needed to create a AccessRequest.
     */
    data: XOR<AccessRequestCreateInput, AccessRequestUncheckedCreateInput>
  }

  /**
   * AccessRequest createMany
   */
  export type AccessRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AccessRequests.
     */
    data: AccessRequestCreateManyInput | AccessRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AccessRequest createManyAndReturn
   */
  export type AccessRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessRequest
     */
    select?: AccessRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AccessRequest
     */
    omit?: AccessRequestOmit<ExtArgs> | null
    /**
     * The data used to create many AccessRequests.
     */
    data: AccessRequestCreateManyInput | AccessRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AccessRequest update
   */
  export type AccessRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessRequest
     */
    select?: AccessRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessRequest
     */
    omit?: AccessRequestOmit<ExtArgs> | null
    /**
     * The data needed to update a AccessRequest.
     */
    data: XOR<AccessRequestUpdateInput, AccessRequestUncheckedUpdateInput>
    /**
     * Choose, which AccessRequest to update.
     */
    where: AccessRequestWhereUniqueInput
  }

  /**
   * AccessRequest updateMany
   */
  export type AccessRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AccessRequests.
     */
    data: XOR<AccessRequestUpdateManyMutationInput, AccessRequestUncheckedUpdateManyInput>
    /**
     * Filter which AccessRequests to update
     */
    where?: AccessRequestWhereInput
    /**
     * Limit how many AccessRequests to update.
     */
    limit?: number
  }

  /**
   * AccessRequest updateManyAndReturn
   */
  export type AccessRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessRequest
     */
    select?: AccessRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AccessRequest
     */
    omit?: AccessRequestOmit<ExtArgs> | null
    /**
     * The data used to update AccessRequests.
     */
    data: XOR<AccessRequestUpdateManyMutationInput, AccessRequestUncheckedUpdateManyInput>
    /**
     * Filter which AccessRequests to update
     */
    where?: AccessRequestWhereInput
    /**
     * Limit how many AccessRequests to update.
     */
    limit?: number
  }

  /**
   * AccessRequest upsert
   */
  export type AccessRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessRequest
     */
    select?: AccessRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessRequest
     */
    omit?: AccessRequestOmit<ExtArgs> | null
    /**
     * The filter to search for the AccessRequest to update in case it exists.
     */
    where: AccessRequestWhereUniqueInput
    /**
     * In case the AccessRequest found by the `where` argument doesn't exist, create a new AccessRequest with this data.
     */
    create: XOR<AccessRequestCreateInput, AccessRequestUncheckedCreateInput>
    /**
     * In case the AccessRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccessRequestUpdateInput, AccessRequestUncheckedUpdateInput>
  }

  /**
   * AccessRequest delete
   */
  export type AccessRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessRequest
     */
    select?: AccessRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessRequest
     */
    omit?: AccessRequestOmit<ExtArgs> | null
    /**
     * Filter which AccessRequest to delete.
     */
    where: AccessRequestWhereUniqueInput
  }

  /**
   * AccessRequest deleteMany
   */
  export type AccessRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccessRequests to delete
     */
    where?: AccessRequestWhereInput
    /**
     * Limit how many AccessRequests to delete.
     */
    limit?: number
  }

  /**
   * AccessRequest without action
   */
  export type AccessRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessRequest
     */
    select?: AccessRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessRequest
     */
    omit?: AccessRequestOmit<ExtArgs> | null
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


  export const SharedAccessScalarFieldEnum: {
    id: 'id',
    ownerWallet: 'ownerWallet',
    viewerWallet: 'viewerWallet',
    mintAddress: 'mintAddress',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type SharedAccessScalarFieldEnum = (typeof SharedAccessScalarFieldEnum)[keyof typeof SharedAccessScalarFieldEnum]


  export const AccessRequestScalarFieldEnum: {
    id: 'id',
    requesterWallet: 'requesterWallet',
    ownerWallet: 'ownerWallet',
    mintAddress: 'mintAddress',
    nftName: 'nftName',
    message: 'message',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccessRequestScalarFieldEnum = (typeof AccessRequestScalarFieldEnum)[keyof typeof AccessRequestScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


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
   * Deep Input Types
   */


  export type SharedAccessWhereInput = {
    AND?: SharedAccessWhereInput | SharedAccessWhereInput[]
    OR?: SharedAccessWhereInput[]
    NOT?: SharedAccessWhereInput | SharedAccessWhereInput[]
    id?: StringFilter<"SharedAccess"> | string
    ownerWallet?: StringFilter<"SharedAccess"> | string
    viewerWallet?: StringFilter<"SharedAccess"> | string
    mintAddress?: StringFilter<"SharedAccess"> | string
    status?: StringFilter<"SharedAccess"> | string
    createdAt?: DateTimeFilter<"SharedAccess"> | Date | string
  }

  export type SharedAccessOrderByWithRelationInput = {
    id?: SortOrder
    ownerWallet?: SortOrder
    viewerWallet?: SortOrder
    mintAddress?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type SharedAccessWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SharedAccessWhereInput | SharedAccessWhereInput[]
    OR?: SharedAccessWhereInput[]
    NOT?: SharedAccessWhereInput | SharedAccessWhereInput[]
    ownerWallet?: StringFilter<"SharedAccess"> | string
    viewerWallet?: StringFilter<"SharedAccess"> | string
    mintAddress?: StringFilter<"SharedAccess"> | string
    status?: StringFilter<"SharedAccess"> | string
    createdAt?: DateTimeFilter<"SharedAccess"> | Date | string
  }, "id">

  export type SharedAccessOrderByWithAggregationInput = {
    id?: SortOrder
    ownerWallet?: SortOrder
    viewerWallet?: SortOrder
    mintAddress?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: SharedAccessCountOrderByAggregateInput
    _max?: SharedAccessMaxOrderByAggregateInput
    _min?: SharedAccessMinOrderByAggregateInput
  }

  export type SharedAccessScalarWhereWithAggregatesInput = {
    AND?: SharedAccessScalarWhereWithAggregatesInput | SharedAccessScalarWhereWithAggregatesInput[]
    OR?: SharedAccessScalarWhereWithAggregatesInput[]
    NOT?: SharedAccessScalarWhereWithAggregatesInput | SharedAccessScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SharedAccess"> | string
    ownerWallet?: StringWithAggregatesFilter<"SharedAccess"> | string
    viewerWallet?: StringWithAggregatesFilter<"SharedAccess"> | string
    mintAddress?: StringWithAggregatesFilter<"SharedAccess"> | string
    status?: StringWithAggregatesFilter<"SharedAccess"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SharedAccess"> | Date | string
  }

  export type AccessRequestWhereInput = {
    AND?: AccessRequestWhereInput | AccessRequestWhereInput[]
    OR?: AccessRequestWhereInput[]
    NOT?: AccessRequestWhereInput | AccessRequestWhereInput[]
    id?: StringFilter<"AccessRequest"> | string
    requesterWallet?: StringFilter<"AccessRequest"> | string
    ownerWallet?: StringFilter<"AccessRequest"> | string
    mintAddress?: StringFilter<"AccessRequest"> | string
    nftName?: StringNullableFilter<"AccessRequest"> | string | null
    message?: StringNullableFilter<"AccessRequest"> | string | null
    status?: StringFilter<"AccessRequest"> | string
    createdAt?: DateTimeFilter<"AccessRequest"> | Date | string
    updatedAt?: DateTimeFilter<"AccessRequest"> | Date | string
  }

  export type AccessRequestOrderByWithRelationInput = {
    id?: SortOrder
    requesterWallet?: SortOrder
    ownerWallet?: SortOrder
    mintAddress?: SortOrder
    nftName?: SortOrderInput | SortOrder
    message?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccessRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    requesterWallet_mintAddress?: AccessRequestRequesterWalletMintAddressCompoundUniqueInput
    AND?: AccessRequestWhereInput | AccessRequestWhereInput[]
    OR?: AccessRequestWhereInput[]
    NOT?: AccessRequestWhereInput | AccessRequestWhereInput[]
    requesterWallet?: StringFilter<"AccessRequest"> | string
    ownerWallet?: StringFilter<"AccessRequest"> | string
    mintAddress?: StringFilter<"AccessRequest"> | string
    nftName?: StringNullableFilter<"AccessRequest"> | string | null
    message?: StringNullableFilter<"AccessRequest"> | string | null
    status?: StringFilter<"AccessRequest"> | string
    createdAt?: DateTimeFilter<"AccessRequest"> | Date | string
    updatedAt?: DateTimeFilter<"AccessRequest"> | Date | string
  }, "id" | "requesterWallet_mintAddress">

  export type AccessRequestOrderByWithAggregationInput = {
    id?: SortOrder
    requesterWallet?: SortOrder
    ownerWallet?: SortOrder
    mintAddress?: SortOrder
    nftName?: SortOrderInput | SortOrder
    message?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccessRequestCountOrderByAggregateInput
    _max?: AccessRequestMaxOrderByAggregateInput
    _min?: AccessRequestMinOrderByAggregateInput
  }

  export type AccessRequestScalarWhereWithAggregatesInput = {
    AND?: AccessRequestScalarWhereWithAggregatesInput | AccessRequestScalarWhereWithAggregatesInput[]
    OR?: AccessRequestScalarWhereWithAggregatesInput[]
    NOT?: AccessRequestScalarWhereWithAggregatesInput | AccessRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AccessRequest"> | string
    requesterWallet?: StringWithAggregatesFilter<"AccessRequest"> | string
    ownerWallet?: StringWithAggregatesFilter<"AccessRequest"> | string
    mintAddress?: StringWithAggregatesFilter<"AccessRequest"> | string
    nftName?: StringNullableWithAggregatesFilter<"AccessRequest"> | string | null
    message?: StringNullableWithAggregatesFilter<"AccessRequest"> | string | null
    status?: StringWithAggregatesFilter<"AccessRequest"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AccessRequest"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AccessRequest"> | Date | string
  }

  export type SharedAccessCreateInput = {
    id?: string
    ownerWallet: string
    viewerWallet: string
    mintAddress: string
    status?: string
    createdAt?: Date | string
  }

  export type SharedAccessUncheckedCreateInput = {
    id?: string
    ownerWallet: string
    viewerWallet: string
    mintAddress: string
    status?: string
    createdAt?: Date | string
  }

  export type SharedAccessUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerWallet?: StringFieldUpdateOperationsInput | string
    viewerWallet?: StringFieldUpdateOperationsInput | string
    mintAddress?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SharedAccessUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerWallet?: StringFieldUpdateOperationsInput | string
    viewerWallet?: StringFieldUpdateOperationsInput | string
    mintAddress?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SharedAccessCreateManyInput = {
    id?: string
    ownerWallet: string
    viewerWallet: string
    mintAddress: string
    status?: string
    createdAt?: Date | string
  }

  export type SharedAccessUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerWallet?: StringFieldUpdateOperationsInput | string
    viewerWallet?: StringFieldUpdateOperationsInput | string
    mintAddress?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SharedAccessUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerWallet?: StringFieldUpdateOperationsInput | string
    viewerWallet?: StringFieldUpdateOperationsInput | string
    mintAddress?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessRequestCreateInput = {
    id?: string
    requesterWallet: string
    ownerWallet: string
    mintAddress: string
    nftName?: string | null
    message?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccessRequestUncheckedCreateInput = {
    id?: string
    requesterWallet: string
    ownerWallet: string
    mintAddress: string
    nftName?: string | null
    message?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccessRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterWallet?: StringFieldUpdateOperationsInput | string
    ownerWallet?: StringFieldUpdateOperationsInput | string
    mintAddress?: StringFieldUpdateOperationsInput | string
    nftName?: NullableStringFieldUpdateOperationsInput | string | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterWallet?: StringFieldUpdateOperationsInput | string
    ownerWallet?: StringFieldUpdateOperationsInput | string
    mintAddress?: StringFieldUpdateOperationsInput | string
    nftName?: NullableStringFieldUpdateOperationsInput | string | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessRequestCreateManyInput = {
    id?: string
    requesterWallet: string
    ownerWallet: string
    mintAddress: string
    nftName?: string | null
    message?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccessRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterWallet?: StringFieldUpdateOperationsInput | string
    ownerWallet?: StringFieldUpdateOperationsInput | string
    mintAddress?: StringFieldUpdateOperationsInput | string
    nftName?: NullableStringFieldUpdateOperationsInput | string | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterWallet?: StringFieldUpdateOperationsInput | string
    ownerWallet?: StringFieldUpdateOperationsInput | string
    mintAddress?: StringFieldUpdateOperationsInput | string
    nftName?: NullableStringFieldUpdateOperationsInput | string | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type SharedAccessCountOrderByAggregateInput = {
    id?: SortOrder
    ownerWallet?: SortOrder
    viewerWallet?: SortOrder
    mintAddress?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type SharedAccessMaxOrderByAggregateInput = {
    id?: SortOrder
    ownerWallet?: SortOrder
    viewerWallet?: SortOrder
    mintAddress?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type SharedAccessMinOrderByAggregateInput = {
    id?: SortOrder
    ownerWallet?: SortOrder
    viewerWallet?: SortOrder
    mintAddress?: SortOrder
    status?: SortOrder
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AccessRequestRequesterWalletMintAddressCompoundUniqueInput = {
    requesterWallet: string
    mintAddress: string
  }

  export type AccessRequestCountOrderByAggregateInput = {
    id?: SortOrder
    requesterWallet?: SortOrder
    ownerWallet?: SortOrder
    mintAddress?: SortOrder
    nftName?: SortOrder
    message?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccessRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    requesterWallet?: SortOrder
    ownerWallet?: SortOrder
    mintAddress?: SortOrder
    nftName?: SortOrder
    message?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccessRequestMinOrderByAggregateInput = {
    id?: SortOrder
    requesterWallet?: SortOrder
    ownerWallet?: SortOrder
    mintAddress?: SortOrder
    nftName?: SortOrder
    message?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
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