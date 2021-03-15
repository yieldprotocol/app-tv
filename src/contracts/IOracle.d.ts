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
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface IOracleInterface extends ethers.utils.Interface {
  functions: {
    "accrual(uint32)": FunctionFragment;
    "record(uint32)": FunctionFragment;
    "spot()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "accrual",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "record",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "spot", values?: undefined): string;

  decodeFunctionResult(functionFragment: "accrual", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "record", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "spot", data: BytesLike): Result;

  events: {};
}

export class IOracle extends Contract {
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

  interface: IOracleInterface;

  functions: {
    accrual(
      maturity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "accrual(uint32)"(
      maturity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    record(
      maturity: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "record(uint32)"(
      maturity: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    spot(overrides?: CallOverrides): Promise<[BigNumber]>;

    "spot()"(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  accrual(
    maturity: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "accrual(uint32)"(
    maturity: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  record(
    maturity: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "record(uint32)"(
    maturity: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  spot(overrides?: CallOverrides): Promise<BigNumber>;

  "spot()"(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    accrual(
      maturity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "accrual(uint32)"(
      maturity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    record(maturity: BigNumberish, overrides?: CallOverrides): Promise<void>;

    "record(uint32)"(
      maturity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    spot(overrides?: CallOverrides): Promise<BigNumber>;

    "spot()"(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    accrual(
      maturity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "accrual(uint32)"(
      maturity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    record(maturity: BigNumberish, overrides?: Overrides): Promise<BigNumber>;

    "record(uint32)"(
      maturity: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    spot(overrides?: CallOverrides): Promise<BigNumber>;

    "spot()"(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    accrual(
      maturity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "accrual(uint32)"(
      maturity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    record(
      maturity: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "record(uint32)"(
      maturity: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    spot(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "spot()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
