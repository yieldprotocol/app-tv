/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface IJoinFactoryInterface extends ethers.utils.Interface {
  functions: {
    "JOIN_BYTECODE_HASH()": FunctionFragment;
    "calculateJoinAddress(address)": FunctionFragment;
    "createJoin(address)": FunctionFragment;
    "getJoin(address)": FunctionFragment;
    "nextAsset()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "JOIN_BYTECODE_HASH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "calculateJoinAddress",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "createJoin", values: [string]): string;
  encodeFunctionData(functionFragment: "getJoin", values: [string]): string;
  encodeFunctionData(functionFragment: "nextAsset", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "JOIN_BYTECODE_HASH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateJoinAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "createJoin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getJoin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "nextAsset", data: BytesLike): Result;

  events: {
    "JoinCreated(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "JoinCreated"): EventFragment;
}

export class IJoinFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: IJoinFactoryInterface;

  functions: {
    JOIN_BYTECODE_HASH(overrides?: CallOverrides): Promise<[string]>;

    calculateJoinAddress(
      asset: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    createJoin(
      asset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getJoin(asset: string, overrides?: CallOverrides): Promise<[string]>;

    nextAsset(overrides?: CallOverrides): Promise<[string]>;
  };

  JOIN_BYTECODE_HASH(overrides?: CallOverrides): Promise<string>;

  calculateJoinAddress(
    asset: string,
    overrides?: CallOverrides
  ): Promise<string>;

  createJoin(
    asset: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getJoin(asset: string, overrides?: CallOverrides): Promise<string>;

  nextAsset(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    JOIN_BYTECODE_HASH(overrides?: CallOverrides): Promise<string>;

    calculateJoinAddress(
      asset: string,
      overrides?: CallOverrides
    ): Promise<string>;

    createJoin(asset: string, overrides?: CallOverrides): Promise<string>;

    getJoin(asset: string, overrides?: CallOverrides): Promise<string>;

    nextAsset(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    JoinCreated(
      asset?: string | null,
      pool?: null
    ): TypedEventFilter<[string, string], { asset: string; pool: string }>;
  };

  estimateGas: {
    JOIN_BYTECODE_HASH(overrides?: CallOverrides): Promise<BigNumber>;

    calculateJoinAddress(
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createJoin(
      asset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getJoin(asset: string, overrides?: CallOverrides): Promise<BigNumber>;

    nextAsset(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    JOIN_BYTECODE_HASH(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calculateJoinAddress(
      asset: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    createJoin(
      asset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getJoin(
      asset: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    nextAsset(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}