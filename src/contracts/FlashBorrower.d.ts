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

interface FlashBorrowerInterface extends ethers.utils.Interface {
  functions: {
    "approveRepayment(address,uint256)": FunctionFragment;
    "flashAmount()": FunctionFragment;
    "flashBalance()": FunctionFragment;
    "flashBorrow(address,uint256)": FunctionFragment;
    "flashBorrowAndNotApprove(address,uint256)": FunctionFragment;
    "flashBorrowAndReenter(address,uint256)": FunctionFragment;
    "flashBorrowAndSteal(address,uint256)": FunctionFragment;
    "flashFee()": FunctionFragment;
    "flashInitiator()": FunctionFragment;
    "flashToken()": FunctionFragment;
    "lender()": FunctionFragment;
    "onFlashLoan(address,address,uint256,uint256,bytes)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "approveRepayment",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "flashAmount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "flashBalance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "flashBorrow",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "flashBorrowAndNotApprove",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "flashBorrowAndReenter",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "flashBorrowAndSteal",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "flashFee", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "flashInitiator",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "flashToken",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "lender", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "onFlashLoan",
    values: [string, string, BigNumberish, BigNumberish, BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "approveRepayment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "flashAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "flashBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "flashBorrow",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "flashBorrowAndNotApprove",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "flashBorrowAndReenter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "flashBorrowAndSteal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "flashFee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "flashInitiator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "flashToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lender", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "onFlashLoan",
    data: BytesLike
  ): Result;

  events: {};
}

export class FlashBorrower extends Contract {
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

  interface: FlashBorrowerInterface;

  functions: {
    approveRepayment(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "approveRepayment(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    flashAmount(overrides?: CallOverrides): Promise<[BigNumber]>;

    "flashAmount()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    flashBalance(overrides?: CallOverrides): Promise<[BigNumber]>;

    "flashBalance()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    flashBorrow(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "flashBorrow(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    flashBorrowAndNotApprove(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "flashBorrowAndNotApprove(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    flashBorrowAndReenter(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "flashBorrowAndReenter(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    flashBorrowAndSteal(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "flashBorrowAndSteal(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    flashFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    "flashFee()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    flashInitiator(overrides?: CallOverrides): Promise<[string]>;

    "flashInitiator()"(overrides?: CallOverrides): Promise<[string]>;

    flashToken(overrides?: CallOverrides): Promise<[string]>;

    "flashToken()"(overrides?: CallOverrides): Promise<[string]>;

    lender(overrides?: CallOverrides): Promise<[string]>;

    "lender()"(overrides?: CallOverrides): Promise<[string]>;

    onFlashLoan(
      initiator: string,
      token: string,
      amount: BigNumberish,
      fee: BigNumberish,
      data: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "onFlashLoan(address,address,uint256,uint256,bytes)"(
      initiator: string,
      token: string,
      amount: BigNumberish,
      fee: BigNumberish,
      data: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  approveRepayment(
    token: string,
    amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "approveRepayment(address,uint256)"(
    token: string,
    amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  flashAmount(overrides?: CallOverrides): Promise<BigNumber>;

  "flashAmount()"(overrides?: CallOverrides): Promise<BigNumber>;

  flashBalance(overrides?: CallOverrides): Promise<BigNumber>;

  "flashBalance()"(overrides?: CallOverrides): Promise<BigNumber>;

  flashBorrow(
    token: string,
    amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "flashBorrow(address,uint256)"(
    token: string,
    amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  flashBorrowAndNotApprove(
    token: string,
    amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "flashBorrowAndNotApprove(address,uint256)"(
    token: string,
    amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  flashBorrowAndReenter(
    token: string,
    amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "flashBorrowAndReenter(address,uint256)"(
    token: string,
    amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  flashBorrowAndSteal(
    token: string,
    amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "flashBorrowAndSteal(address,uint256)"(
    token: string,
    amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  flashFee(overrides?: CallOverrides): Promise<BigNumber>;

  "flashFee()"(overrides?: CallOverrides): Promise<BigNumber>;

  flashInitiator(overrides?: CallOverrides): Promise<string>;

  "flashInitiator()"(overrides?: CallOverrides): Promise<string>;

  flashToken(overrides?: CallOverrides): Promise<string>;

  "flashToken()"(overrides?: CallOverrides): Promise<string>;

  lender(overrides?: CallOverrides): Promise<string>;

  "lender()"(overrides?: CallOverrides): Promise<string>;

  onFlashLoan(
    initiator: string,
    token: string,
    amount: BigNumberish,
    fee: BigNumberish,
    data: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "onFlashLoan(address,address,uint256,uint256,bytes)"(
    initiator: string,
    token: string,
    amount: BigNumberish,
    fee: BigNumberish,
    data: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    approveRepayment(
      token: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "approveRepayment(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    flashAmount(overrides?: CallOverrides): Promise<BigNumber>;

    "flashAmount()"(overrides?: CallOverrides): Promise<BigNumber>;

    flashBalance(overrides?: CallOverrides): Promise<BigNumber>;

    "flashBalance()"(overrides?: CallOverrides): Promise<BigNumber>;

    flashBorrow(
      token: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "flashBorrow(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    flashBorrowAndNotApprove(
      token: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "flashBorrowAndNotApprove(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    flashBorrowAndReenter(
      token: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "flashBorrowAndReenter(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    flashBorrowAndSteal(
      token: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "flashBorrowAndSteal(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    flashFee(overrides?: CallOverrides): Promise<BigNumber>;

    "flashFee()"(overrides?: CallOverrides): Promise<BigNumber>;

    flashInitiator(overrides?: CallOverrides): Promise<string>;

    "flashInitiator()"(overrides?: CallOverrides): Promise<string>;

    flashToken(overrides?: CallOverrides): Promise<string>;

    "flashToken()"(overrides?: CallOverrides): Promise<string>;

    lender(overrides?: CallOverrides): Promise<string>;

    "lender()"(overrides?: CallOverrides): Promise<string>;

    onFlashLoan(
      initiator: string,
      token: string,
      amount: BigNumberish,
      fee: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    "onFlashLoan(address,address,uint256,uint256,bytes)"(
      initiator: string,
      token: string,
      amount: BigNumberish,
      fee: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {};

  estimateGas: {
    approveRepayment(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "approveRepayment(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    flashAmount(overrides?: CallOverrides): Promise<BigNumber>;

    "flashAmount()"(overrides?: CallOverrides): Promise<BigNumber>;

    flashBalance(overrides?: CallOverrides): Promise<BigNumber>;

    "flashBalance()"(overrides?: CallOverrides): Promise<BigNumber>;

    flashBorrow(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "flashBorrow(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    flashBorrowAndNotApprove(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "flashBorrowAndNotApprove(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    flashBorrowAndReenter(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "flashBorrowAndReenter(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    flashBorrowAndSteal(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "flashBorrowAndSteal(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    flashFee(overrides?: CallOverrides): Promise<BigNumber>;

    "flashFee()"(overrides?: CallOverrides): Promise<BigNumber>;

    flashInitiator(overrides?: CallOverrides): Promise<BigNumber>;

    "flashInitiator()"(overrides?: CallOverrides): Promise<BigNumber>;

    flashToken(overrides?: CallOverrides): Promise<BigNumber>;

    "flashToken()"(overrides?: CallOverrides): Promise<BigNumber>;

    lender(overrides?: CallOverrides): Promise<BigNumber>;

    "lender()"(overrides?: CallOverrides): Promise<BigNumber>;

    onFlashLoan(
      initiator: string,
      token: string,
      amount: BigNumberish,
      fee: BigNumberish,
      data: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "onFlashLoan(address,address,uint256,uint256,bytes)"(
      initiator: string,
      token: string,
      amount: BigNumberish,
      fee: BigNumberish,
      data: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    approveRepayment(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "approveRepayment(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    flashAmount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "flashAmount()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    flashBalance(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "flashBalance()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    flashBorrow(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "flashBorrow(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    flashBorrowAndNotApprove(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "flashBorrowAndNotApprove(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    flashBorrowAndReenter(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "flashBorrowAndReenter(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    flashBorrowAndSteal(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "flashBorrowAndSteal(address,uint256)"(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    flashFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "flashFee()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    flashInitiator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "flashInitiator()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    flashToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "flashToken()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lender(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "lender()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    onFlashLoan(
      initiator: string,
      token: string,
      amount: BigNumberish,
      fee: BigNumberish,
      data: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "onFlashLoan(address,address,uint256,uint256,bytes)"(
      initiator: string,
      token: string,
      amount: BigNumberish,
      fee: BigNumberish,
      data: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}
