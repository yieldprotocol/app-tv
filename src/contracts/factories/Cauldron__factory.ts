/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { Cauldron, CauldronInterface } from "../Cauldron";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes6",
        name: "assetId",
        type: "bytes6",
      },
      {
        indexed: true,
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "AssetAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint32",
        name: "auctionInterval",
        type: "uint32",
      },
    ],
    name: "AuctionIntervalSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes6",
        name: "seriesId",
        type: "bytes6",
      },
      {
        indexed: true,
        internalType: "bytes6",
        name: "ilkId",
        type: "bytes6",
      },
    ],
    name: "IlkAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes6",
        name: "baseId",
        type: "bytes6",
      },
      {
        indexed: true,
        internalType: "bytes6",
        name: "ilkId",
        type: "bytes6",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "max",
        type: "uint128",
      },
    ],
    name: "MaxDebtSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes6",
        name: "baseId",
        type: "bytes6",
      },
      {
        indexed: true,
        internalType: "address",
        name: "oracle",
        type: "address",
      },
    ],
    name: "RateOracleAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes4",
        name: "role",
        type: "bytes4",
      },
      {
        indexed: true,
        internalType: "bytes4",
        name: "newAdminRole",
        type: "bytes4",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes4",
        name: "role",
        type: "bytes4",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes4",
        name: "role",
        type: "bytes4",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes6",
        name: "seriesId",
        type: "bytes6",
      },
      {
        indexed: true,
        internalType: "bytes6",
        name: "baseId",
        type: "bytes6",
      },
      {
        indexed: true,
        internalType: "address",
        name: "fyToken",
        type: "address",
      },
    ],
    name: "SeriesAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes6",
        name: "seriesId",
        type: "bytes6",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rateAtMaturity",
        type: "uint256",
      },
    ],
    name: "SeriesMatured",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes6",
        name: "baseId",
        type: "bytes6",
      },
      {
        indexed: true,
        internalType: "bytes6",
        name: "ilkId",
        type: "bytes6",
      },
      {
        indexed: true,
        internalType: "address",
        name: "oracle",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "ratio",
        type: "uint32",
      },
    ],
    name: "SpotOracleAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes12",
        name: "vaultId",
        type: "bytes12",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes6",
        name: "seriesId",
        type: "bytes6",
      },
      {
        indexed: false,
        internalType: "bytes6",
        name: "ilkId",
        type: "bytes6",
      },
    ],
    name: "VaultBuilt",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes12",
        name: "vaultId",
        type: "bytes12",
      },
    ],
    name: "VaultDestroyed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes12",
        name: "vaultId",
        type: "bytes12",
      },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "VaultGiven",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes12",
        name: "vaultId",
        type: "bytes12",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "VaultLocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes12",
        name: "vaultId",
        type: "bytes12",
      },
      {
        indexed: true,
        internalType: "bytes6",
        name: "seriesId",
        type: "bytes6",
      },
      {
        indexed: true,
        internalType: "bytes6",
        name: "ilkId",
        type: "bytes6",
      },
      {
        indexed: false,
        internalType: "int128",
        name: "ink",
        type: "int128",
      },
      {
        indexed: false,
        internalType: "int128",
        name: "art",
        type: "int128",
      },
    ],
    name: "VaultPoured",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes12",
        name: "vaultId",
        type: "bytes12",
      },
      {
        indexed: true,
        internalType: "bytes6",
        name: "seriesId",
        type: "bytes6",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "art",
        type: "uint128",
      },
    ],
    name: "VaultRolled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes12",
        name: "from",
        type: "bytes12",
      },
      {
        indexed: true,
        internalType: "bytes12",
        name: "to",
        type: "bytes12",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "ink",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "art",
        type: "uint128",
      },
    ],
    name: "VaultStirred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes12",
        name: "vaultId",
        type: "bytes12",
      },
      {
        indexed: true,
        internalType: "bytes6",
        name: "seriesId",
        type: "bytes6",
      },
      {
        indexed: true,
        internalType: "bytes6",
        name: "ilkId",
        type: "bytes6",
      },
    ],
    name: "VaultTweaked",
    type: "event",
  },
  {
    inputs: [],
    name: "LOCK",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ROOT",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes6",
        name: "seriesId",
        type: "bytes6",
      },
    ],
    name: "accrual",
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
    inputs: [
      {
        internalType: "bytes6",
        name: "assetId",
        type: "bytes6",
      },
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "addAsset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes6",
        name: "seriesId",
        type: "bytes6",
      },
      {
        internalType: "bytes6[]",
        name: "ilkIds",
        type: "bytes6[]",
      },
    ],
    name: "addIlks",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes6",
        name: "seriesId",
        type: "bytes6",
      },
      {
        internalType: "bytes6",
        name: "baseId",
        type: "bytes6",
      },
      {
        internalType: "contract IFYToken",
        name: "fyToken",
        type: "address",
      },
    ],
    name: "addSeries",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes6",
        name: "",
        type: "bytes6",
      },
    ],
    name: "assets",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "auctionInterval",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes12",
        name: "",
        type: "bytes12",
      },
    ],
    name: "auctions",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes12",
        name: "",
        type: "bytes12",
      },
    ],
    name: "balances",
    outputs: [
      {
        internalType: "uint128",
        name: "art",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "ink",
        type: "uint128",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "bytes12",
        name: "vaultId",
        type: "bytes12",
      },
      {
        internalType: "bytes6",
        name: "seriesId",
        type: "bytes6",
      },
      {
        internalType: "bytes6",
        name: "ilkId",
        type: "bytes6",
      },
    ],
    name: "build",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "bytes6",
            name: "seriesId",
            type: "bytes6",
          },
          {
            internalType: "bytes6",
            name: "ilkId",
            type: "bytes6",
          },
        ],
        internalType: "struct DataTypes.Vault",
        name: "vault",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes6",
        name: "",
        type: "bytes6",
      },
      {
        internalType: "bytes6",
        name: "",
        type: "bytes6",
      },
    ],
    name: "debt",
    outputs: [
      {
        internalType: "uint128",
        name: "max",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "sum",
        type: "uint128",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes12",
        name: "vaultId",
        type: "bytes12",
      },
    ],
    name: "destroy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "role",
        type: "bytes4",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes12",
        name: "vaultId",
        type: "bytes12",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "give",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "bytes6",
            name: "seriesId",
            type: "bytes6",
          },
          {
            internalType: "bytes6",
            name: "ilkId",
            type: "bytes6",
          },
        ],
        internalType: "struct DataTypes.Vault",
        name: "vault",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes12",
        name: "vaultId",
        type: "bytes12",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "grab",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "role",
        type: "bytes4",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4[]",
        name: "roles",
        type: "bytes4[]",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRoles",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "role",
        type: "bytes4",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes6",
        name: "",
        type: "bytes6",
      },
      {
        internalType: "bytes6",
        name: "",
        type: "bytes6",
      },
    ],
    name: "ilks",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes12",
        name: "vaultId",
        type: "bytes12",
      },
    ],
    name: "level",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "role",
        type: "bytes4",
      },
    ],
    name: "lockRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes6",
        name: "seriesId",
        type: "bytes6",
      },
    ],
    name: "mature",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes12",
        name: "vaultId",
        type: "bytes12",
      },
      {
        internalType: "int128",
        name: "ink",
        type: "int128",
      },
      {
        internalType: "int128",
        name: "art",
        type: "int128",
      },
    ],
    name: "pour",
    outputs: [
      {
        components: [
          {
            internalType: "uint128",
            name: "art",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "ink",
            type: "uint128",
          },
        ],
        internalType: "struct DataTypes.Balances",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes6",
        name: "",
        type: "bytes6",
      },
    ],
    name: "rateOracles",
    outputs: [
      {
        internalType: "contract IOracle",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes6",
        name: "",
        type: "bytes6",
      },
    ],
    name: "ratesAtMaturity",
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
        internalType: "bytes4",
        name: "role",
        type: "bytes4",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "role",
        type: "bytes4",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4[]",
        name: "roles",
        type: "bytes4[]",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRoles",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes12",
        name: "vaultId",
        type: "bytes12",
      },
      {
        internalType: "bytes6",
        name: "newSeriesId",
        type: "bytes6",
      },
      {
        internalType: "int128",
        name: "art",
        type: "int128",
      },
    ],
    name: "roll",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "bytes6",
            name: "seriesId",
            type: "bytes6",
          },
          {
            internalType: "bytes6",
            name: "ilkId",
            type: "bytes6",
          },
        ],
        internalType: "struct DataTypes.Vault",
        name: "",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint128",
            name: "art",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "ink",
            type: "uint128",
          },
        ],
        internalType: "struct DataTypes.Balances",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes6",
        name: "",
        type: "bytes6",
      },
    ],
    name: "series",
    outputs: [
      {
        internalType: "contract IFYToken",
        name: "fyToken",
        type: "address",
      },
      {
        internalType: "bytes6",
        name: "baseId",
        type: "bytes6",
      },
      {
        internalType: "uint32",
        name: "maturity",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "auctionInterval_",
        type: "uint32",
      },
    ],
    name: "setAuctionInterval",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes6",
        name: "baseId",
        type: "bytes6",
      },
      {
        internalType: "bytes6",
        name: "ilkId",
        type: "bytes6",
      },
      {
        internalType: "uint128",
        name: "max",
        type: "uint128",
      },
    ],
    name: "setMaxDebt",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes6",
        name: "baseId",
        type: "bytes6",
      },
      {
        internalType: "contract IOracle",
        name: "oracle",
        type: "address",
      },
    ],
    name: "setRateOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "role",
        type: "bytes4",
      },
      {
        internalType: "bytes4",
        name: "adminRole",
        type: "bytes4",
      },
    ],
    name: "setRoleAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes6",
        name: "baseId",
        type: "bytes6",
      },
      {
        internalType: "bytes6",
        name: "ilkId",
        type: "bytes6",
      },
      {
        internalType: "contract IOracle",
        name: "oracle",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "ratio",
        type: "uint32",
      },
    ],
    name: "setSpotOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes12",
        name: "vaultId",
        type: "bytes12",
      },
      {
        internalType: "uint128",
        name: "ink",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "art",
        type: "uint128",
      },
    ],
    name: "slurp",
    outputs: [
      {
        components: [
          {
            internalType: "uint128",
            name: "art",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "ink",
            type: "uint128",
          },
        ],
        internalType: "struct DataTypes.Balances",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes6",
        name: "",
        type: "bytes6",
      },
      {
        internalType: "bytes6",
        name: "",
        type: "bytes6",
      },
    ],
    name: "spotOracles",
    outputs: [
      {
        internalType: "contract IOracle",
        name: "oracle",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "ratio",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes12",
        name: "from",
        type: "bytes12",
      },
      {
        internalType: "bytes12",
        name: "to",
        type: "bytes12",
      },
      {
        internalType: "uint128",
        name: "ink",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "art",
        type: "uint128",
      },
    ],
    name: "stir",
    outputs: [
      {
        components: [
          {
            internalType: "uint128",
            name: "art",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "ink",
            type: "uint128",
          },
        ],
        internalType: "struct DataTypes.Balances",
        name: "",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint128",
            name: "art",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "ink",
            type: "uint128",
          },
        ],
        internalType: "struct DataTypes.Balances",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes12",
        name: "vaultId",
        type: "bytes12",
      },
      {
        internalType: "bytes6",
        name: "seriesId",
        type: "bytes6",
      },
      {
        internalType: "bytes6",
        name: "ilkId",
        type: "bytes6",
      },
    ],
    name: "tweak",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "bytes6",
            name: "seriesId",
            type: "bytes6",
          },
          {
            internalType: "bytes6",
            name: "ilkId",
            type: "bytes6",
          },
        ],
        internalType: "struct DataTypes.Vault",
        name: "vault",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes12",
        name: "",
        type: "bytes12",
      },
    ],
    name: "vaults",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "bytes6",
        name: "seriesId",
        type: "bytes6",
      },
      {
        internalType: "bytes6",
        name: "ilkId",
        type: "bytes6",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class Cauldron__factory {
  static readonly abi = _abi;
  static createInterface(): CauldronInterface {
    return new utils.Interface(_abi) as CauldronInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Cauldron {
    return new Contract(address, _abi, signerOrProvider) as Cauldron;
  }
}
