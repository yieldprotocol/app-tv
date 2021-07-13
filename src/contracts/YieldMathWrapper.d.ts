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
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface YieldMathWrapperInterface extends ethers.utils.Interface {
  functions: {
    "baseInForFYTokenOut(uint128,uint128,uint128,uint128,int128,int128)": FunctionFragment;
    "baseOutForFYTokenIn(uint128,uint128,uint128,uint128,int128,int128)": FunctionFragment;
    "fyTokenInForBaseOut(uint128,uint128,uint128,uint128,int128,int128)": FunctionFragment;
    "fyTokenOutForBaseIn(uint128,uint128,uint128,uint128,int128,int128)": FunctionFragment;
    "log_2(uint128)": FunctionFragment;
    "pow(uint128,uint128,uint128)": FunctionFragment;
    "pow_2(uint128)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "baseInForFYTokenOut",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "baseOutForFYTokenIn",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "fyTokenInForBaseOut",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "fyTokenOutForBaseIn",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(functionFragment: "log_2", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "pow",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "pow_2", values: [BigNumberish]): string;

  decodeFunctionResult(
    functionFragment: "baseInForFYTokenOut",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "baseOutForFYTokenIn",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fyTokenInForBaseOut",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fyTokenOutForBaseIn",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "log_2", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pow", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pow_2", data: BytesLike): Result;

  events: {};
}

export class YieldMathWrapper extends BaseContract {
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

  interface: YieldMathWrapperInterface;

  functions: {
    baseInForFYTokenOut(
      baseReserves: BigNumberish,
      fyTokenReserves: BigNumberish,
      fyTokenAmount: BigNumberish,
      timeTillMaturity: BigNumberish,
      k: BigNumberish,
      g: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    baseOutForFYTokenIn(
      baseReserves: BigNumberish,
      fyTokenReserves: BigNumberish,
      fyTokenAmount: BigNumberish,
      timeTillMaturity: BigNumberish,
      k: BigNumberish,
      g: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    fyTokenInForBaseOut(
      baseReserves: BigNumberish,
      fyTokenReserves: BigNumberish,
      baseAmount: BigNumberish,
      timeTillMaturity: BigNumberish,
      k: BigNumberish,
      g: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    fyTokenOutForBaseIn(
      baseReserves: BigNumberish,
      fyTokenReserves: BigNumberish,
      baseAmount: BigNumberish,
      timeTillMaturity: BigNumberish,
      k: BigNumberish,
      g: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    log_2(
      x: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean, BigNumber]>;

    pow(
      x: BigNumberish,
      y: BigNumberish,
      z: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean, BigNumber]>;

    pow_2(
      x: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean, BigNumber]>;
  };

  baseInForFYTokenOut(
    baseReserves: BigNumberish,
    fyTokenReserves: BigNumberish,
    fyTokenAmount: BigNumberish,
    timeTillMaturity: BigNumberish,
    k: BigNumberish,
    g: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  baseOutForFYTokenIn(
    baseReserves: BigNumberish,
    fyTokenReserves: BigNumberish,
    fyTokenAmount: BigNumberish,
    timeTillMaturity: BigNumberish,
    k: BigNumberish,
    g: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  fyTokenInForBaseOut(
    baseReserves: BigNumberish,
    fyTokenReserves: BigNumberish,
    baseAmount: BigNumberish,
    timeTillMaturity: BigNumberish,
    k: BigNumberish,
    g: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  fyTokenOutForBaseIn(
    baseReserves: BigNumberish,
    fyTokenReserves: BigNumberish,
    baseAmount: BigNumberish,
    timeTillMaturity: BigNumberish,
    k: BigNumberish,
    g: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  log_2(
    x: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[boolean, BigNumber]>;

  pow(
    x: BigNumberish,
    y: BigNumberish,
    z: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[boolean, BigNumber]>;

  pow_2(
    x: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[boolean, BigNumber]>;

  callStatic: {
    baseInForFYTokenOut(
      baseReserves: BigNumberish,
      fyTokenReserves: BigNumberish,
      fyTokenAmount: BigNumberish,
      timeTillMaturity: BigNumberish,
      k: BigNumberish,
      g: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    baseOutForFYTokenIn(
      baseReserves: BigNumberish,
      fyTokenReserves: BigNumberish,
      fyTokenAmount: BigNumberish,
      timeTillMaturity: BigNumberish,
      k: BigNumberish,
      g: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    fyTokenInForBaseOut(
      baseReserves: BigNumberish,
      fyTokenReserves: BigNumberish,
      baseAmount: BigNumberish,
      timeTillMaturity: BigNumberish,
      k: BigNumberish,
      g: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    fyTokenOutForBaseIn(
      baseReserves: BigNumberish,
      fyTokenReserves: BigNumberish,
      baseAmount: BigNumberish,
      timeTillMaturity: BigNumberish,
      k: BigNumberish,
      g: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    log_2(
      x: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean, BigNumber]>;

    pow(
      x: BigNumberish,
      y: BigNumberish,
      z: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean, BigNumber]>;

    pow_2(
      x: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean, BigNumber]>;
  };

  filters: {};

  estimateGas: {
    baseInForFYTokenOut(
      baseReserves: BigNumberish,
      fyTokenReserves: BigNumberish,
      fyTokenAmount: BigNumberish,
      timeTillMaturity: BigNumberish,
      k: BigNumberish,
      g: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    baseOutForFYTokenIn(
      baseReserves: BigNumberish,
      fyTokenReserves: BigNumberish,
      fyTokenAmount: BigNumberish,
      timeTillMaturity: BigNumberish,
      k: BigNumberish,
      g: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    fyTokenInForBaseOut(
      baseReserves: BigNumberish,
      fyTokenReserves: BigNumberish,
      baseAmount: BigNumberish,
      timeTillMaturity: BigNumberish,
      k: BigNumberish,
      g: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    fyTokenOutForBaseIn(
      baseReserves: BigNumberish,
      fyTokenReserves: BigNumberish,
      baseAmount: BigNumberish,
      timeTillMaturity: BigNumberish,
      k: BigNumberish,
      g: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    log_2(x: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    pow(
      x: BigNumberish,
      y: BigNumberish,
      z: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    pow_2(x: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    baseInForFYTokenOut(
      baseReserves: BigNumberish,
      fyTokenReserves: BigNumberish,
      fyTokenAmount: BigNumberish,
      timeTillMaturity: BigNumberish,
      k: BigNumberish,
      g: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    baseOutForFYTokenIn(
      baseReserves: BigNumberish,
      fyTokenReserves: BigNumberish,
      fyTokenAmount: BigNumberish,
      timeTillMaturity: BigNumberish,
      k: BigNumberish,
      g: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    fyTokenInForBaseOut(
      baseReserves: BigNumberish,
      fyTokenReserves: BigNumberish,
      baseAmount: BigNumberish,
      timeTillMaturity: BigNumberish,
      k: BigNumberish,
      g: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    fyTokenOutForBaseIn(
      baseReserves: BigNumberish,
      fyTokenReserves: BigNumberish,
      baseAmount: BigNumberish,
      timeTillMaturity: BigNumberish,
      k: BigNumberish,
      g: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    log_2(
      x: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pow(
      x: BigNumberish,
      y: BigNumberish,
      z: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pow_2(
      x: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
