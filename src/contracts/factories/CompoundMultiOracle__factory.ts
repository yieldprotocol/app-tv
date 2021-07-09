/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from 'ethers';
import { Provider } from '@ethersproject/providers';
import type { CompoundMultiOracle, CompoundMultiOracleInterface } from '../CompoundMultiOracle';

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes4',
        name: 'role',
        type: 'bytes4',
      },
      {
        indexed: true,
        internalType: 'bytes4',
        name: 'newAdminRole',
        type: 'bytes4',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes4',
        name: 'role',
        type: 'bytes4',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes4',
        name: 'role',
        type: 'bytes4',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes6',
        name: 'baseId',
        type: 'bytes6',
      },
      {
        indexed: true,
        internalType: 'bytes6',
        name: 'kind',
        type: 'bytes6',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'source',
        type: 'address',
      },
    ],
    name: 'SourceSet',
    type: 'event',
  },
  {
    inputs: [],
    name: 'LOCK',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ROOT',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SCALE_FACTOR',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'base',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'kind',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'get',
    outputs: [
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'updateTime',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'role',
        type: 'bytes4',
      },
    ],
    name: 'getRoleAdmin',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'role',
        type: 'bytes4',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4[]',
        name: 'roles',
        type: 'bytes4[]',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'grantRoles',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'role',
        type: 'bytes4',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'hasRole',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'role',
        type: 'bytes4',
      },
    ],
    name: 'lockRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'base',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'kind',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'peek',
    outputs: [
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'updateTime',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'role',
        type: 'bytes4',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'role',
        type: 'bytes4',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4[]',
        name: 'roles',
        type: 'bytes4[]',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'revokeRoles',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'role',
        type: 'bytes4',
      },
      {
        internalType: 'bytes4',
        name: 'adminRole',
        type: 'bytes4',
      },
    ],
    name: 'setRoleAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes6',
        name: 'base',
        type: 'bytes6',
      },
      {
        internalType: 'bytes6',
        name: 'kind',
        type: 'bytes6',
      },
      {
        internalType: 'address',
        name: 'source',
        type: 'address',
      },
    ],
    name: 'setSource',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes6[]',
        name: 'bases',
        type: 'bytes6[]',
      },
      {
        internalType: 'bytes6[]',
        name: 'kinds',
        type: 'bytes6[]',
      },
      {
        internalType: 'address[]',
        name: 'sources_',
        type: 'address[]',
      },
    ],
    name: 'setSources',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes6',
        name: '',
        type: 'bytes6',
      },
      {
        internalType: 'bytes6',
        name: '',
        type: 'bytes6',
      },
    ],
    name: 'sources',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export class CompoundMultiOracle__factory {
  static readonly abi = _abi;
  static createInterface(): CompoundMultiOracleInterface {
    return new utils.Interface(_abi) as CompoundMultiOracleInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): CompoundMultiOracle {
    return new Contract(address, _abi, signerOrProvider) as CompoundMultiOracle;
  }
}
