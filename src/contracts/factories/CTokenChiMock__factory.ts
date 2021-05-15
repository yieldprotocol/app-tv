/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { CTokenChiMock, CTokenChiMockInterface } from "../CTokenChiMock";

const _abi = [
  {
    inputs: [],
    name: "exchangeRateCurrent",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "exchangeRateStored",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chi",
        type: "uint256",
      },
    ],
    name: "set",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class CTokenChiMock__factory {
  static readonly abi = _abi;
  static createInterface(): CTokenChiMockInterface {
    return new utils.Interface(_abi) as CTokenChiMockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CTokenChiMock {
    return new Contract(address, _abi, signerOrProvider) as CTokenChiMock;
  }
}