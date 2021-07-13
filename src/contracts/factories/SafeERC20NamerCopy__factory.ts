/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  SafeERC20NamerCopy,
  SafeERC20NamerCopyInterface,
} from "../SafeERC20NamerCopy";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "tokenDecimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "tokenName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "tokenSymbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class SafeERC20NamerCopy__factory {
  static readonly abi = _abi;
  static createInterface(): SafeERC20NamerCopyInterface {
    return new utils.Interface(_abi) as SafeERC20NamerCopyInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SafeERC20NamerCopy {
    return new Contract(address, _abi, signerOrProvider) as SafeERC20NamerCopy;
  }
}
