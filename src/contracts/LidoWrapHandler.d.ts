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
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface LidoWrapHandlerInterface extends ethers.utils.Interface {
  functions: {
    "stETH()": FunctionFragment;
    "unwrap(address)": FunctionFragment;
    "wrap(address)": FunctionFragment;
    "wstETH()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "stETH", values?: undefined): string;
  encodeFunctionData(functionFragment: "unwrap", values: [string]): string;
  encodeFunctionData(functionFragment: "wrap", values: [string]): string;
  encodeFunctionData(functionFragment: "wstETH", values?: undefined): string;

  decodeFunctionResult(functionFragment: "stETH", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "unwrap", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "wrap", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "wstETH", data: BytesLike): Result;

  events: {
    "Unwrapped(address,uint256)": EventFragment;
    "Wrapped(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Unwrapped"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Wrapped"): EventFragment;
}

export type UnwrappedEvent = TypedEvent<
  [string, BigNumber] & { to: string; amount: BigNumber }
>;

export type WrappedEvent = TypedEvent<
  [string, BigNumber] & { to: string; amount: BigNumber }
>;

export class LidoWrapHandler extends BaseContract {
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

  interface: LidoWrapHandlerInterface;

  functions: {
    stETH(overrides?: CallOverrides): Promise<[string]>;

    unwrap(
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    wrap(
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    wstETH(overrides?: CallOverrides): Promise<[string]>;
  };

  stETH(overrides?: CallOverrides): Promise<string>;

  unwrap(
    to: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  wrap(
    to: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  wstETH(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    stETH(overrides?: CallOverrides): Promise<string>;

    unwrap(to: string, overrides?: CallOverrides): Promise<BigNumber>;

    wrap(to: string, overrides?: CallOverrides): Promise<BigNumber>;

    wstETH(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "Unwrapped(address,uint256)"(
      to?: null,
      amount?: null
    ): TypedEventFilter<[string, BigNumber], { to: string; amount: BigNumber }>;

    Unwrapped(
      to?: null,
      amount?: null
    ): TypedEventFilter<[string, BigNumber], { to: string; amount: BigNumber }>;

    "Wrapped(address,uint256)"(
      to?: null,
      amount?: null
    ): TypedEventFilter<[string, BigNumber], { to: string; amount: BigNumber }>;

    Wrapped(
      to?: null,
      amount?: null
    ): TypedEventFilter<[string, BigNumber], { to: string; amount: BigNumber }>;
  };

  estimateGas: {
    stETH(overrides?: CallOverrides): Promise<BigNumber>;

    unwrap(
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    wrap(
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    wstETH(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    stETH(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    unwrap(
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    wrap(
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    wstETH(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}