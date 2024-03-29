/* eslint-disable @typescript-eslint/naming-convention */
import { ethers, BigNumber, BigNumberish } from 'ethers';
import { Decimal } from 'decimal.js';
import { MAX_256, WAD_BN, ZERO_BN } from './constants';

Decimal.set({ precision: 64 });

/* constants exposed for export */
export const ZERO_DEC: Decimal = new Decimal(0);
export const ONE_DEC: Decimal = new Decimal(1);
export const TWO_DEC: Decimal = new Decimal(2);
export const MAX_DEC: Decimal = new Decimal(MAX_256);

export const SECONDS_PER_YEAR: number = 365 * 24 * 60 * 60;

export const secondsInOneYear = BigNumber.from(31557600);
export const secondsInTenYears = secondsInOneYear.mul(10); // Seconds in 10 years

/* Convenience naming local constants */
const ZERO = ZERO_DEC;
const ONE = ONE_DEC;
const TWO = TWO_DEC;
const MAX = MAX_DEC;

/* Protocol Specific Constants */
const k = new Decimal(1 / secondsInTenYears.toNumber()).mul(2 ** 64); // inv of seconds in 10 years
const g1_default = new Decimal(950 / 1000).mul(2 ** 64);
const g2_default = new Decimal(1000 / 950).mul(2 ** 64);
const precisionFee = new Decimal(1000000000000);

/** *************************
 Support functions
 *************************** */

/**
 * Convert a bignumber with any decimal to a bn with decimal of 18
 * @param x bn to convert.
 * @param decimals of the current bignumber
 * @returns BigNumber
 */
export const decimalNToDecimal18 = (x: BigNumber, decimals: number): BigNumber =>
  BigNumber.from(x.toString() + '0'.repeat(18 - decimals));

/**
 * Convert a decimal18 to a bn of any decimal
 * @param x 18 decimal to reduce
 * @param decimals required
 * @returns BigNumber
 */
export const decimal18ToDecimalN = (x: BigNumber, decimals: number): BigNumber => {
  const str = x.toString();
  const first = str.slice(0, str.length - (18 - decimals));
  return BigNumber.from(first || 0); // zero if slice removes more than the number of decimals
};

/**
 * Convert bytesX to bytes32 (BigEndian?)
 * @param x string to convert.
 * @param n current bytes value eg. bytes6 or bytes12
 * @returns string bytes32
 */
export function bytesToBytes32(x: string, n: number): string {
  return x + '00'.repeat(32 - n);
}

/**
 * Calculate the baseId from the series nae
 * @param seriesId seriesID.
 * @returns string bytes32
 */
export function baseIdFromSeriesId(seriesId: string): string {
  return seriesId.slice(0, 6).concat('00000000');
}

/**
 * @param { BigNumber | string } multiplicant
 * @param { BigNumber | string } multiplier
 * @param { string } precisionDifference  // Difference between multiplicant and mulitplier precision (eg. wei vs ray '1e-27' )
 * @returns { string } in decimal precision of the multiplicant
 */
export const mulDecimal = (
  multiplicant: BigNumber | string,
  multiplier: BigNumber | string,
  precisionDifference: string = '1' // DEFAULT = 1 (same precision)
): string => {
  const multiplicant_ = new Decimal(multiplicant.toString());
  const multiplier_ = new Decimal(multiplier.toString());
  const _preDif = new Decimal(precisionDifference.toString());
  const _normalisedMul = multiplier_.mul(_preDif);
  return multiplicant_.mul(_normalisedMul).toFixed();
};

/**
 * @param  { BigNumber | string } numerator
 * @param { BigNumber | string } divisor
 * @param { BigNumber | string } precisionDifference // Difference between multiplicant and mulitplier precision (eg. wei vs ray '1e-27' )
 * @returns { string } in decimal precision of the numerator
 */
export const divDecimal = (
  numerator: BigNumber | string,
  divisor: BigNumber | string,
  precisionDifference: string = '1' // DEFAULT = 1 (same precision)
): string => {
  const numerator_ = new Decimal(numerator.toString());
  const divisor_ = new Decimal(divisor.toString());
  const _preDif = new Decimal(precisionDifference.toString());
  const _normalisedDiv = divisor_.mul(_preDif);
  return numerator_.div(_normalisedDiv).toFixed();
};

/**
 * @param { BigNumber | string } value
 * @returns { string }
 */
export const floorDecimal = (value: BigNumber | string): string => Decimal.floor(value.toString()).toFixed();

/**
 * @param { Decimal } value
 * @returns { BigNumber }
 */
export const toBn = (value: Decimal): BigNumber => BigNumber.from(floorDecimal(value.toFixed()));

/**
 * @param { BigNumber | string } to unix time
 * @param { BigNumber | string } from  unix time *optional* default: now
 * @returns { string } as number seconds 'from' -> 'to'
 */
export const secondsToFrom = (
  to: BigNumber | string,
  from: BigNumber | string = BigNumber.from(Math.round(new Date().getTime() / 1000)) // OPTIONAL: FROM defaults to current time if omitted
): string => {
  const to_ = ethers.BigNumber.isBigNumber(to) ? to : BigNumber.from(to);
  const from_ = ethers.BigNumber.isBigNumber(from) ? from : BigNumber.from(from);
  return to_.sub(from_).toString();
};

/**
 * specific Yieldspace helper functions
 * */
const _computeA = (
  timeToMaturity: BigNumber | string,
  ts: BigNumber | string,
  g: BigNumber | string
): [Decimal, Decimal] => {
  const timeTillMaturity_ = new Decimal(timeToMaturity.toString());
  // console.log( new Decimal(BigNumber.from(g).toString()).div(2 ** 64).toString() )

  const _g = new Decimal(BigNumber.from(g).toString()).div(2 ** 64);
  const _ts = new Decimal(BigNumber.from(ts).toString()).div(2 ** 64);

  // t = ts * timeTillMaturity
  const t = _ts.mul(timeTillMaturity_);
  // a = (1 - gt)
  const a = ONE.sub(_g.mul(t));
  const invA = ONE.div(a);
  return [a, invA]; /* returns a and inverse of a */
};

const _computeB = (
  timeToMaturity: BigNumber | string,
  ts: BigNumber | string,
  g: BigNumber | string
): [Decimal, Decimal] => {
  const timeTillMaturity_ = new Decimal(timeToMaturity.toString());

  const _g = new Decimal(BigNumber.from(g).toString()).div(2 ** 64);
  const _ts = new Decimal(BigNumber.from(ts).toString()).div(2 ** 64);

  // t = ts * timeTillMaturity
  const t = _ts.mul(timeTillMaturity_);
  // b = (1 - t/g)
  const b = ONE.sub(t.div(_g));
  const invB = ONE.div(b);
  return [b, invB]; /* returns b and inverse of b */
};

/** ************************
 YieldSpace functions
 *************************** */

/**
 * @param { BigNumber | string } baseReserves
 * @param { BigNumber | string } fyTokenReserves
 * @param { BigNumber | string } totalSupply
 * @param { BigNumber | string } base
 * @returns {[BigNumber, BigNumber]}
 *
 * https://www.desmos.com/calculator/mllhtohxfx
 */
export function mint(
  baseReserves: BigNumber | string,
  fyTokenReserves: BigNumber | string,
  totalSupply: BigNumber | string,
  base: BigNumber | string,
  fromBase: boolean = false
): [BigNumber, BigNumber] {
  const baseReserves_ = new Decimal(baseReserves.toString());
  const fyTokenReserves_ = new Decimal(fyTokenReserves.toString());
  const supply_ = new Decimal(totalSupply.toString());
  const base_ = new Decimal(base.toString());

  const m = fromBase ? supply_.mul(base_).div(baseReserves_) : supply_.mul(base_).div(fyTokenReserves_);
  const y = fromBase ? fyTokenReserves_.mul(m).div(supply_) : baseReserves_.mul(m).div(supply_);

  return [toBn(m), toBn(y)];
}

/**
 * @param { BigNumber | string } baseReserves
 * @param { BigNumber | string } fyTokenRealReserves
 * @param { BigNumber | string } totalSupply
 * @param { BigNumber | string } lpTokens
 * @returns {[BigNumber, BigNumber]}
 *
 * https://www.desmos.com/calculator/ubsalzunpo
 */
export function burn(
  baseReserves: BigNumber | string,
  fyTokenRealReserves: BigNumber | string,
  totalSupply: BigNumber | string,
  lpTokens: BigNumber | string
): [BigNumber, BigNumber] {
  const Z = new Decimal(baseReserves.toString());
  const Y = new Decimal(fyTokenRealReserves.toString());
  const S = new Decimal(totalSupply.toString());
  const x = new Decimal(lpTokens.toString());
  const z = x.mul(Z).div(S);
  const y = x.mul(Y).div(S);
  return [toBn(z), toBn(y)];
}

/**
 *
 * @param { BigNumber | string } poolTotalSupply
 * @param { BigNumber | string } strategyTotalsupply
 * @param { BigNumber | string } strategyTokensToBurn
 *
 * @returns {BigNumber}
 *
 */
export function burnFromStrategy(
  poolTotalSupply: BigNumber | string,
  strategyTotalsupply: BigNumber | string,
  strategyTokensToBurn: BigNumber | string
): BigNumber {
  const pS = new Decimal(poolTotalSupply.toString());
  const sS = new Decimal(strategyTotalsupply.toString());
  const tS = new Decimal(strategyTokensToBurn.toString());
  const x = pS.mul(tS.div(sS));
  return toBn(x);
}

/**
 * @param { BigNumber } baseReserves
 * @param { BigNumber } fyTokenReservesVirtual
 * @param { BigNumber } fyTokenReservesReal
 * @param { BigNumber | string } fyToken
 * @param { BigNumber | string } timeTillMaturity
 * @param { BigNumber | string } ts
 * @param { BigNumber | string } g1
 * @param { number } decimals
 *
 * @returns {[BigNumber, BigNumber]}
 */
export function mintWithBase(
  baseReserves: BigNumber,
  fyTokenReservesVirtual: BigNumber,
  fyTokenReservesReal: BigNumber,
  fyToken: BigNumber | string,
  timeTillMaturity: BigNumber | string,
  ts: BigNumber | string,
  g1: BigNumber | string,
  decimals: number
): [BigNumber, BigNumber] {
  const Z = new Decimal(baseReserves.toString());
  const YR = new Decimal(fyTokenReservesReal.toString());
  const supply = fyTokenReservesVirtual.sub(fyTokenReservesReal);
  const y = new Decimal(fyToken.toString());
  // buyFyToken:
  const z1 = new Decimal(
    buyFYToken(baseReserves, fyTokenReservesVirtual, fyToken, timeTillMaturity, ts, g1, decimals).toString()
  );
  const Z2 = Z.add(z1); // Base reserves after the trade
  const YR2 = YR.sub(y); // FYToken reserves after the trade

  // Mint specifying how much fyToken to take in. Reverse of `mint`.
  const [minted, z2] = mint(toBn(Z2), toBn(YR2), supply, fyToken, false);

  return [minted, toBn(z1).add(z2)];
}

/**
 * @param { BigNumber | string } baseReserves
 * @param { BigNumber | string } fyTokenReservesVirtual
 * @param { BigNumber | string } fyTokenReservesReal
 * @param { BigNumber | string } totalSupply
 * @param { BigNumber | string } lpTokens
 * @param { BigNumber | string } timeTillMaturity
 * @param { BigNumber | string } ts
 * @param { BigNumber | string } g2
 * @param { number } decimals
 *
 * @returns { BigNumber }
 */
export function burnForBase(
  baseReserves: BigNumber,
  fyTokenReservesVirtual: BigNumber,
  fyTokenReservesReal: BigNumber,
  lpTokens: BigNumber,
  timeTillMaturity: BigNumber | string,
  ts: BigNumber | string,
  g2: BigNumber | string,
  decimals: number
): BigNumber {
  const supply = fyTokenReservesVirtual.sub(fyTokenReservesReal);
  // Burn FyToken
  const [z1, y] = burn(baseReserves, fyTokenReservesReal, supply, lpTokens);
  // Sell FyToken for base
  const z2 = sellFYToken(baseReserves, fyTokenReservesVirtual, y, timeTillMaturity, ts, g2, decimals);
  const z1D = new Decimal(z1.toString());
  const z2D = new Decimal(z2.toString());
  return toBn(z1D.add(z2D));
}

/**
 * Calculate the amount of fyToken a user would get for given amount of Base.
 * fyTokenOutForBaseIn
 * @param { BigNumber | string } baseReserves
 * @param { BigNumber | string } fyTokenReserves
 * @param { BigNumber | string } base
 * @param { BigNumber | string } timeTillMaturity
 * @param { BigNumber | string } ts
 * @param { BigNumber | string } g1
 * @param { number } decimals
 *
 * @returns { BigNumber }
 */
export function sellBase(
  baseReserves: BigNumber | string,
  fyTokenReserves: BigNumber | string,
  base: BigNumber | string,
  timeTillMaturity: BigNumber | string,
  ts: BigNumber | string,
  g1: BigNumber | string,
  decimals: number
): BigNumber {
  /* convert to 18 decimals, if required */
  const baseReserves18 = decimalNToDecimal18(BigNumber.from(baseReserves), decimals);
  const fyTokenReserves18 = decimalNToDecimal18(BigNumber.from(fyTokenReserves), decimals);
  const base18 = decimalNToDecimal18(BigNumber.from(base), decimals);

  const baseReserves_ = new Decimal(baseReserves18.toString());
  const fyTokenReserves_ = new Decimal(fyTokenReserves18.toString());
  const base_ = new Decimal(base18.toString());

  const [a, invA] = _computeA(timeTillMaturity, ts, g1);

  const Za = baseReserves_.pow(a);
  const Ya = fyTokenReserves_.pow(a);
  const Zxa = baseReserves_.add(base_).pow(a);
  const sum = Za.add(Ya).sub(Zxa);
  const y = fyTokenReserves_.sub(sum.pow(invA));

  const yFee = y.sub(precisionFee);
  return yFee.isNaN() ? ethers.constants.Zero : decimal18ToDecimalN(toBn(yFee), decimals);
}

/**
 * Calculate the amount of base a user would get for certain amount of fyToken.
 * baseOutForFYTokenIn
 * @param { BigNumber | string } baseReserves
 * @param { BigNumber | string } fyTokenReserves
 * @param { BigNumber | string } fyToken
 * @param { BigNumber | string } timeTillMaturity
 * @param { BigNumber | string } ts
 * @param { BigNumber | string } g2
 * @param { number } decimals
 *
 * @returns { BigNumber }
 */
export function sellFYToken(
  baseReserves: BigNumber | string,
  fyTokenReserves: BigNumber | string,
  fyToken: BigNumber | string,
  timeTillMaturity: BigNumber | string,
  ts: BigNumber | string,
  g2: BigNumber | string,
  decimals: number
): BigNumber {
  /* convert to 18 decimals, if required */
  const baseReserves18 = decimalNToDecimal18(BigNumber.from(baseReserves), decimals);
  const fyTokenReserves18 = decimalNToDecimal18(BigNumber.from(fyTokenReserves), decimals);
  const fyToken18 = decimalNToDecimal18(BigNumber.from(fyToken), decimals);

  const baseReserves_ = new Decimal(baseReserves18.toString());
  const fyTokenReserves_ = new Decimal(fyTokenReserves18.toString());
  const fyDai_ = new Decimal(fyToken18.toString());

  const [a, invA] = _computeA(timeTillMaturity, ts, g2);

  const Za = baseReserves_.pow(a);
  const Ya = fyTokenReserves_.pow(a);
  const Yxa = fyTokenReserves_.add(fyDai_).pow(a);
  const sum = Za.add(Ya.sub(Yxa));
  const y = baseReserves_.sub(sum.pow(invA));

  const yFee = y.sub(precisionFee);

  return yFee.isNaN() ? ethers.constants.Zero : decimal18ToDecimalN(toBn(yFee), decimals);
}

/**
 * Calculate the amount of fyToken a user could sell for given amount of Base.
 * fyTokenInForBaseOut
 * @param { BigNumber | string } baseReserves
 * @param { BigNumber | string } fyTokenReserves
 * @param { BigNumber | string } base
 * @param { BigNumber | string } timeTillMaturity
 * @param { BigNumber | string } ts
 * @param { BigNumber | string } g2
 * @param { number } decimals
 *
 * @returns { BigNumber }
 */
export function buyBase(
  baseReserves: BigNumber | string,
  fyTokenReserves: BigNumber | string,
  base: BigNumber | string,
  timeTillMaturity: BigNumber | string,
  ts: BigNumber | string,
  g2: BigNumber | string,
  decimals: number
): BigNumber {
  /* convert to 18 decimals, if required */
  const baseReserves18 = decimalNToDecimal18(BigNumber.from(baseReserves), decimals);
  const fyTokenReserves18 = decimalNToDecimal18(BigNumber.from(fyTokenReserves), decimals);
  const base18 = decimalNToDecimal18(BigNumber.from(base), decimals);

  const baseReserves_ = new Decimal(baseReserves18.toString());
  const fyTokenReserves_ = new Decimal(fyTokenReserves18.toString());
  const base_ = new Decimal(base18.toString());

  const [a, invA] = _computeA(timeTillMaturity, ts, g2);

  const Za = baseReserves_.pow(a);
  const Ya = fyTokenReserves_.pow(a);
  const Zxa = baseReserves_.sub(base_).pow(a);
  const sum = Za.add(Ya).sub(Zxa);
  const y = sum.pow(invA).sub(fyTokenReserves_);

  const yFee = y.add(precisionFee);

  return yFee.isNaN() ? ethers.constants.Zero : decimal18ToDecimalN(toBn(yFee), decimals);
}

/**
 * Calculate the amount of base a user would have to pay for certain amount of fyToken.
 * baseInForFYTokenOut
 * @param { BigNumber | string } baseReserves
 * @param { BigNumber | string } fyTokenReserves
 * @param { BigNumber | string } fyToken
 * @param { BigNumber | string } timeTillMaturity
 * @param { BigNumber | string } ts
 * @param { BigNumber | string } g1
 * @param { number } decimals
 *
 * @returns { BigNumber }
 */
export function buyFYToken(
  baseReserves: BigNumber | string,
  fyTokenReserves: BigNumber | string,
  fyToken: BigNumber | string,
  timeTillMaturity: BigNumber | string,
  ts: BigNumber | string,
  g1: BigNumber | string,
  decimals: number
): BigNumber {
  /* convert to 18 decimals, if required */
  const baseReserves18 = decimalNToDecimal18(BigNumber.from(baseReserves), decimals);
  const fyTokenReserves18 = decimalNToDecimal18(BigNumber.from(fyTokenReserves), decimals);
  const fyToken18 = decimalNToDecimal18(BigNumber.from(fyToken), decimals);

  const baseReserves_ = new Decimal(baseReserves18.toString());
  const fyTokenReserves_ = new Decimal(fyTokenReserves18.toString());
  const fyDai_ = new Decimal(fyToken18.toString());

  // const _g = withNoFee ? ONE : g1;
  const [a, invA] = _computeA(timeTillMaturity, ts, g1);

  const Za = baseReserves_.pow(a);
  const Ya = fyTokenReserves_.pow(a);
  const Yxa = fyTokenReserves_.sub(fyDai_).pow(a);
  const sum = Za.add(Ya.sub(Yxa));
  const y = sum.pow(invA).sub(baseReserves_);

  const yFee = y.add(precisionFee);
  return yFee.isNaN() ? ethers.constants.Zero : decimal18ToDecimalN(toBn(yFee), decimals);
}

/**
 * Calculate the max amount of base that can be sold to into the pool without making the interest rate negative.
 *
 * @param { BigNumber | string } baseReserves
 * @param { BigNumber | string } fyTokenReserves
 * @param { BigNumber | string } timeTillMaturity
 * @param { BigNumber | string } ts
 * @param { BigNumber | string } g1
 * @param { number } decimals
 *
 * @returns { BigNumber } max amount of base that can be bought from the pool
 *
 */
export function maxBaseIn(
  baseReserves: BigNumber,
  fyTokenReserves: BigNumber,
  timeTillMaturity: BigNumber | string,
  ts: BigNumber | string,
  g1: BigNumber | string,
  decimals: number
): BigNumber {
  /* calculate the max possible fyToken (fyToken amount) */
  const fyTokenAmountOut = maxFyTokenOut(baseReserves, fyTokenReserves, timeTillMaturity, ts, g1, decimals);

  /* convert to 18 decimals, if required */
  const baseReserves18 = decimalNToDecimal18(baseReserves, decimals);
  const fyTokenReserves18 = decimalNToDecimal18(fyTokenReserves, decimals);
  const fyTokenAmountOut18 = decimalNToDecimal18(fyTokenAmountOut, decimals);

  const baseReserves_ = new Decimal(baseReserves18.toString());
  const fyTokenReserves_ = new Decimal(fyTokenReserves18.toString());
  const fyTokenAmountOut_ = new Decimal(fyTokenAmountOut18.toString());

  /*  abort if maxFyTokenOut() is zero */
  if (fyTokenAmountOut_.eq(ZERO)) return ZERO_BN;

  // baseInForFYTokenOut(baseReserves, fyTokenReserves, _maxFYTokenOut, timeTillMaturity, ts, g)
  const [a, invA] = _computeA(timeTillMaturity, ts, g1);
  const za = baseReserves_.pow(a);
  const ya = fyTokenReserves_.pow(a);
  // yx =
  const yx = fyTokenReserves_.sub(fyTokenAmountOut_);
  // yxa = yx ** a
  const yxa = yx.pow(a);

  // sum = za + ya - yxa
  const sum = za.add(ya).sub(yxa);

  // result = (sum ** (1/a)) - baseReserves
  const res = sum.pow(invA).sub(baseReserves_);

  /* Handle precision variations */
  const safeRes = res.gt(MAX.sub(precisionFee)) ? MAX : res.add(precisionFee);

  /* Convert to back to token native decimals, if required */
  return decimal18ToDecimalN(toBn(safeRes), decimals);
}

/**
 * Calculate the max amount of base that can be bought from the pool.
 *
 * @param { BigNumber | string } baseReserves
 * @param { BigNumber | string } fyTokenReserves
 * @param { BigNumber | string } timeTillMaturity
 * @param { BigNumber | string } ts
 * @param { BigNumber | string } g2
 * @param { number } decimals
 *
 * @returns { BigNumber } max amount of base that can be bought from the pool
 *
 */
export function maxBaseOut(
  baseReserves: BigNumber,
  fyTokenReserves: BigNumber,
  timeTillMaturity: BigNumber | string,
  ts: BigNumber | string,
  g2: BigNumber | string,
  decimals: number
): BigNumber {
  /* calculate the max possible fyToken (fyToken amount) */
  const fyTokenAmountIn = maxFyTokenIn(baseReserves, fyTokenReserves, timeTillMaturity, ts, g2, decimals);

  /* convert to 18 decimals, if required */
  const baseReserves18 = decimalNToDecimal18(baseReserves, decimals);
  const fyTokenReserves18 = decimalNToDecimal18(fyTokenReserves, decimals);
  const fyTokenAmountIn18 = decimalNToDecimal18(fyTokenAmountIn, decimals);

  const baseReserves_ = new Decimal(baseReserves18.toString());
  const fyTokenReserves_ = new Decimal(fyTokenReserves18.toString());
  const fyTokenAmountIn_ = new Decimal(fyTokenAmountIn18.toString());

  // baseOutForFYTokenIn(baseReserves, fyTokenReserves, _maxFYTokenIn, timeTillMaturity, ts, g);
  const [a, invA] = _computeA(timeTillMaturity, ts, g2);
  const za = baseReserves_.pow(a);
  const ya = fyTokenReserves_.pow(a);

  // yx = fyDayReserves + fyTokenAmount
  const yx = fyTokenReserves_.add(fyTokenAmountIn_);
  // yxa = yx ** a
  const yxa = yx.pow(a);
  // sum = za + ya - yxa
  const sum = za.add(ya).sub(yxa);
  // result = baseReserves - (sum ** (1/a))
  const res = baseReserves_.sub(sum.pow(invA));

  /* Handle precision variations */
  const safeRes = res.gt(precisionFee) ? res.sub(precisionFee) : ZERO;

  /* Convert to back to token native decimals, if required */
  return decimal18ToDecimalN(toBn(safeRes), decimals);
}

/**
 * Calculate the max amount of fyTokens that can be sold to into the pool.
 *
 * @param { BigNumber | string } baseReserves
 * @param { BigNumber | string } fyTokenReserves
 * @param { BigNumber | string } timeTillMaturity
 * @param { BigNumber | string } ts
 * @param { BigNumber | string } g2
 * @param { number } decimals
 *
 * @returns { BigNumber }
 */
export function maxFyTokenIn(
  baseReserves: BigNumber,
  fyTokenReserves: BigNumber,
  timeTillMaturity: BigNumber | string,
  ts: BigNumber | string,
  g2: BigNumber | string,
  decimals: number
): BigNumber {
  /* convert to 18 decimals, if required */
  const baseReserves18 = decimalNToDecimal18(baseReserves, decimals);
  const fyTokenReserves18 = decimalNToDecimal18(fyTokenReserves, decimals);
  const baseReserves_ = new Decimal(baseReserves18.toString());
  const fyTokenReserves_ = new Decimal(fyTokenReserves18.toString());

  const [b, invB] = _computeB(timeTillMaturity, ts, g2);

  const xa = baseReserves_.pow(b);
  const ya = fyTokenReserves_.pow(b);
  const sum = xa.add(ya);

  const res = sum.pow(invB).sub(fyTokenReserves_);

  /* Handle precision variations */
  const safeRes = res.gt(precisionFee) ? res.sub(precisionFee) : ZERO;

  /* convert to back to token native decimals, if required */
  return decimal18ToDecimalN(toBn(safeRes), decimals);
}

/**
 * Calculate the max amount of fyTokens that can be bought from the pool without making the interest rate negative.
 * See section 6.3 of the YieldSpace White paper
 *
 * @param { BigNumber | string } baseReserves
 * @param { BigNumber | string } fyTokenReserves
 * @param { BigNumber | string } timeTillMaturity
 * @param { BigNumber | string } ts
 * @param { BigNumber | string } g1
 * @param { number } decimals
 *
 * @returns { BigNumber }
 */
export function maxFyTokenOut(
  baseReserves: BigNumber,
  fyTokenReserves: BigNumber,
  timeTillMaturity: BigNumber | string,
  ts: BigNumber | string,
  g1: BigNumber | string,
  decimals: number
): BigNumber {
  /* convert to 18 decimals, if required */
  const baseReserves18 = decimalNToDecimal18(baseReserves, decimals);
  const fyTokenReserves18 = decimalNToDecimal18(fyTokenReserves, decimals);

  /* convert to decimal for the math */
  const baseReserves_ = new Decimal(baseReserves18.toString());
  const fyTokenReserves_ = new Decimal(fyTokenReserves18.toString());

  const [a, invA] = _computeA(timeTillMaturity, ts, g1);

  const xa = baseReserves_.pow(a);
  const ya = fyTokenReserves_.pow(a);
  const xy = xa.add(ya);

  const inaccessible = xy.div(2).pow(invA);
  const res = inaccessible.gt(fyTokenReserves_) ? ZERO : fyTokenReserves_.sub(inaccessible);

  /* Handle precision variations */
  const safeRes = res.gt(MAX.sub(precisionFee)) ? MAX : res.add(precisionFee);

  /* convert to back to token native decimals, if required */
  return decimal18ToDecimalN(toBn(safeRes), decimals);
}

/**
 * Calculate the amount of fyToken that should be bought when providing liquidity with only underlying.
 * The amount bought leaves a bit of unused underlying, to allow for the pool reserves to change between
 * the calculation and the mint. The pool returns any unused underlying.
 *
 * @param baseReserves
 * @param fyTokenRealReserves
 * @param fyTokenVirtualReserves
 * @param base
 * @param timeTillMaturity
 * @param ts
 * @param g1
 * @param decimals
 * @param slippage How far from the optimum we want to be
 * @param precision How wide the range in which we will accept a value
 * @returns fyTokenToBuy, surplus
 */

export function fyTokenForMint(
  baseReserves: BigNumber,
  fyTokenRealReserves: BigNumber,
  fyTokenVirtualReserves: BigNumber,
  base: BigNumber | string,
  timeTillMaturity: BigNumber | string,
  ts: BigNumber | string,
  g1: BigNumber | string,
  decimals: number,
  slippage: number = 0.01, // 1% default
  precision: number = 0.0001 // 0.01% default
): [BigNumber, BigNumber] {
  const base_ = new Decimal(base.toString());
  const minSurplus = base_.mul(slippage);
  const maxSurplus = minSurplus.add(base_.mul(precision));

  let maxFYToken = new Decimal(
    maxFyTokenOut(baseReserves, fyTokenVirtualReserves, timeTillMaturity, ts, g1, decimals).toString()
  );
  let minFYToken = ZERO_DEC;

  if (maxFYToken.lt(2)) return [ZERO_BN, ZERO_BN]; // won't be able to parse using toBn

  let i = 0;
  while (true) {
    /* NB return ZERO when not converging > not mintable */
    // eslint-disable-next-line no-plusplus
    if (i++ > 100) {
      console.log('No solution');
      return [ZERO_BN, ZERO_BN];
    }

    const fyTokenToBuy = minFYToken.add(maxFYToken).div(2);
    // console.log('fyToken tobuy',  fyTokenToBuy.toFixed() )

    const baseIn = mintWithBase(
      baseReserves,
      fyTokenVirtualReserves,
      fyTokenRealReserves,
      toBn(fyTokenToBuy),
      timeTillMaturity,
      ts,
      g1,
      decimals
    )[1];

    const surplus = base_.sub(new Decimal(baseIn.toString()));
    // console.log( 'min:',  minSurplus.toFixed() ,  'max:',   maxSurplus.toFixed() , 'surplus: ', surplus.toFixed() )

    // Just right
    if (minSurplus.lt(surplus) && surplus.lt(maxSurplus)) {
      // console.log('fyToken to buy: ', fyTokenToBuy.toFixed(), 'surplus: ', surplus.toFixed());
      return [toBn(fyTokenToBuy), toBn(surplus)];
    }

    // Bought too much, lower the max and the buy
    if (baseIn.gt(base) || surplus.lt(minSurplus)) {
      // console.log('Bought too much');
      maxFYToken = fyTokenToBuy;
    }

    // Bought too little, raise the min and the buy
    if (surplus.gt(maxSurplus)) {
      // console.log('Bought too little');
      minFYToken = fyTokenToBuy;
    }
  }
}

export function fyTokenForMintOld(
  baseReserves: BigNumber | string,
  fyTokenRealReserves: BigNumber | string,
  fyTokenVirtualReserves: BigNumber | string,
  base: BigNumber | string,
  timeTillMaturity: BigNumber | string,
  ts: BigNumber | string,
  g1: BigNumber | string,
  decimals: number,
  slippage: number = 0.01 // 1% default
): BigNumber {
  /* convert to 18 decimals */
  const baseReserves18 = decimalNToDecimal18(BigNumber.from(baseReserves), decimals);
  const fyTokenRealReserves18 = decimalNToDecimal18(BigNumber.from(fyTokenRealReserves), decimals);
  const fyTokenVirtualReserves18 = decimalNToDecimal18(BigNumber.from(fyTokenVirtualReserves), decimals);
  const base18 = decimalNToDecimal18(BigNumber.from(base), decimals);

  const baseReserves_ = new Decimal(baseReserves18.toString());
  const fyDaiRealReserves_ = new Decimal(fyTokenRealReserves18.toString());
  const base_ = new Decimal(base18.toString());
  const timeTillMaturity_ = new Decimal(timeTillMaturity.toString());
  const slippage_ = new Decimal(slippage); // .mul(new Decimal(10)); /* multiply the user slippage by 10 */

  let min = ZERO;
  let max = base_.mul(TWO);
  let yOut = min.add(max).div(TWO).floor();
  let zIn: Decimal;

  let i = 0;
  while (true) {
    /* NB return ZERO when not converging > not mintable */
    // eslint-disable-next-line no-plusplus
    if (i++ > 100) return ZERO_BN;
    // if (i++ > 100)  throw 'Not converging'

    zIn = new Decimal(
      buyFYToken(
        baseReserves18,
        fyTokenVirtualReserves18,
        BigNumber.from(yOut.floor().toFixed()),
        timeTillMaturity_.toString(),
        ts,
        g1,
        18
      ).toString()
    );

    const Z_1 = baseReserves_.add(zIn); // New base balance
    const z_1 = base_.sub(zIn); // My remaining base
    const Y_1 = fyDaiRealReserves_.sub(yOut); // New fyToken balance
    const y_1 = yOut; // My fyToken
    const pz = z_1.div(z_1.add(y_1)); // base proportion in my assets
    const PZ = Z_1.div(Z_1.add(Y_1)); // base proportion in the balances

    const slippageAllowance = PZ.mul(slippage_); // PZ with slippage
    const PZ_min = PZ.add(slippageAllowance); // should be 100% (PZ) + slippage
    const PZ_max = PZ.add(slippageAllowance).mul(new Decimal(1.00001)); // should be 100.01% () + slippage

    // The base proportion in my assets needs to be higher than but very close to the
    // base proportion in the balances, to make sure all the fyToken is used.
    // eslint-disable-next-line no-plusplus
    if (PZ_max > pz && PZ_min < pz) {
      break; // Too many iterations, or found the result
    } else if (PZ_max <= pz) {
      min = yOut;
      yOut = yOut.add(max).div(TWO); // bought too little fyToken, buy some more
    } else {
      max = yOut;
      yOut = yOut.add(min).div(TWO); // bought too much fyToken, buy a bit less
    }
  }

  //  console.log( 'yOut : ', yOut.toFixed());
  //  console.log( 'buyFyTOKEN: ', zIn.toString() );

  return decimal18ToDecimalN(
    // (converted back to original decimals)
    BigNumber.from(yOut.floor().toFixed()),
    decimals
  );
}

/**
 * Split a certain amount of X liquidity into its two components (eg. base and fyToken)
 * @param { BigNumber } xReserves // eg. base reserves
 * @param { BigNumber } yReserves // eg. fyToken reservers
 * @param {BigNumber} xAmount // amount to split in wei
 * @param {BigNumber} asBn
 * @returns  [ BigNumber, BigNumber ] returns an array of [base, fyToken]
 */
export const splitLiquidity = (
  xReserves: BigNumber | string,
  yReserves: BigNumber | string,
  xAmount: BigNumber | string,
  asBn: boolean = true
): [BigNumberish, BigNumberish] => {
  const xReserves_ = new Decimal(xReserves.toString());
  const yReserves_ = new Decimal(yReserves.toString());
  const xAmount_ = new Decimal(xAmount.toString());
  const xPortion = xAmount_.mul(xReserves_).div(yReserves_.add(xReserves_));
  const yPortion = xAmount_.sub(xPortion);
  if (asBn) return [toBn(xPortion), toBn(yPortion)];
  return [xPortion.toFixed(), yPortion.toFixed()];
};

/**
 * Calculate Slippage
 * @param { BigNumber } value
 * @param { BigNumber } slippage optional: defaults to 0.005 (0.5%)
 * @param { boolean } minimise optional: whether the result should be a minimum or maximum (default max)
 * @returns { string } human readable string
 */
export const calculateSlippage = (
  value: BigNumber | string,
  slippage: BigNumber | string = '0.005',
  minimise: boolean = false
): string => {
  const value_ = new Decimal(value.toString());
  const _slippageAmount = floorDecimal(mulDecimal(value, slippage));
  if (minimise) {
    return value_.sub(_slippageAmount).toFixed();
  }
  return value_.add(_slippageAmount).toFixed();
};

/**
 * Calculate Annualised Yield Rate
 * @param { BigNumber | string } tradeValue // current [base]
 * @param { BigNumber | string } amount // y[base] amount at maturity
 * @param { number } maturity  // date of maturity
 * @param { number } fromDate // ***optional*** start date - defaults to now()
 * @returns { string | undefined } human readable string
 */
export const calculateAPR = (
  tradeValue: BigNumber | string,
  amount: BigNumber | string,
  maturity: number,
  fromDate: number = Math.round(new Date().getTime() / 1000) // if not provided, defaults to current time.
): string | undefined => {
  const tradeValue_ = new Decimal(tradeValue.toString());
  const amount_ = new Decimal(amount.toString());

  if (maturity > Math.round(new Date().getTime() / 1000)) {
    const secsToMaturity = maturity - fromDate;
    const propOfYear = new Decimal(secsToMaturity / SECONDS_PER_YEAR);
    const priceRatio = amount_.div(tradeValue_);
    const powRatio = ONE.div(propOfYear);
    const apr = priceRatio.pow(powRatio).sub(ONE);

    if (apr.gt(ZERO) && apr.lt(100)) {
      return apr.mul(100).toFixed();
    }
    return undefined;
  }
  return undefined;
};

/**
 * Calculates the collateralization ratio
 * based on the collat amount and value and debt value.
 * @param { BigNumber | string } collateralAmount  amount of collateral (in wei)
 * @param { BigNumber | string } basePrice bases per unit of collateral (in wei)
 * @param { BigNumber | string } baseAmount amount base debt (in wei)
 * @param {boolean} asPercent OPTIONAL: flag to return ratio as a percentage
 * @returns { string | undefined }
 */
export const calculateCollateralizationRatio = (
  collateralAmount: BigNumber | string,
  basePrice: BigNumber | string,
  baseAmount: BigNumber | string,
  asPercent: boolean = false // OPTIONAL:  flag to return as percentage
): string | undefined => {
  if (ethers.BigNumber.isBigNumber(baseAmount) ? baseAmount.isZero() : baseAmount === '0') {
    return undefined;
  }
  const _baseUnitPrice = divDecimal(basePrice, WAD_BN);
  // const _baseUnitPrice = divDecimal(basePrice, decimal18ToDecimalN(WAD_BN, decimals).toString());
  const _baseVal = divDecimal(baseAmount, _baseUnitPrice); // base/debt value in terms of collateral
  const _ratio = divDecimal(collateralAmount, _baseVal); // collateralValue divide by debtValue

  if (asPercent) {
    return mulDecimal('100', _ratio);
  }
  return _ratio;
};

/**
 * Calculates the collateralization ratio
 * based on the collat amount and value and debt value.
 * @param { BigNumber | string } basePrice bases per unit collateral (in wei)
 * @param { BigNumber | string } baseAmount amount of bases / debt (in wei)
 * @param {BigNumber | string} liquidationRatio  OPTIONAL: 1.5 (150%) as default
 * @param {BigNumber | string} existingCollateral  0 as default (as wei)
 * @param {Boolean} asBigNumber return as big number? in wei
 *
 * @returns { string | undefined }
 */
export const calculateMinCollateral = (
  basePrice: BigNumber | string,
  baseAmount: BigNumber | string,
  liquidationRatio: string,
  existingCollateral: BigNumber | string = '0', // OPTIONAL add in
  asBigNumber: boolean = false
): string | BigNumber => {
  const _baseUnitPrice = divDecimal(basePrice, WAD_BN);
  const _baseVal = divDecimal(baseAmount, _baseUnitPrice);
  const _existingCollateralValue = new Decimal(ethers.utils.formatUnits(existingCollateral, 18));
  const _minCollatValue = new Decimal(mulDecimal(_baseVal, liquidationRatio));
  const requiredCollateral = _existingCollateralValue.gt(_minCollatValue)
    ? new Decimal('0')
    : _minCollatValue.sub(_existingCollateralValue); // .add('1'); // hmm, i had to add one check

  return asBigNumber ? toBn(requiredCollateral) : requiredCollateral.toFixed(0);
};

/**
 * Calcualtes the amount (base, or other variant) that can be borrowed based on
 * an amount of collateral (ETH, or other), and collateral price.
 *
 * @param {BigNumber | string} collateralAmount amount of collateral
 * @param {BigNumber | string} collateralPrice price of unit collateral (in currency x)
 * @param {BigNumber | string} debtValue value of debt (in currency x)
 * @param {BigNumber | string} liquidationRatio  OPTIONAL: 1.5 (150%) as default
 *
 * @returns {string}
 */
export const calculateBorrowingPower = (
  collateralAmount: BigNumber | string,
  collateralPrice: BigNumber | string,
  debtValue: BigNumber | string,
  liquidationRatio: string = '1.5' // OPTIONAL: 150% as default
): string => {
  const collateralValue = mulDecimal(collateralAmount, collateralPrice);
  const maxSafeDebtValue_ = new Decimal(divDecimal(collateralValue, liquidationRatio));
  const debtValue_ = new Decimal(debtValue.toString());
  const _max = debtValue_.lt(maxSafeDebtValue_) ? maxSafeDebtValue_.sub(debtValue_) : new Decimal('0');
  return _max.toFixed(0);
};

/**
 * Calcualtes the amount (base, or other variant) that can be borrowed based on
 * an amount of collateral (ETH, or other), and collateral price.
 *
 * @param {string} collateralAmount amount of collateral in human readable decimals
 * @param {string} debtAmount amount of debt in human readable decimals
 * @param {number} liquidationRatio  OPTIONAL: 1.5 (150%) as default
 *
 * @returns {string}
 */
export const calcLiquidationPrice = (
  collateralAmount: string, //
  debtAmount: string,
  liquidationRatio: number
): string => {
  const _collateralAmount = parseFloat(collateralAmount);
  const _debtAmount = parseFloat(debtAmount);
  // condition/logic: collAmount*price > debtAmount*ratio
  const liquidationPoint = _debtAmount * liquidationRatio;
  const price = (liquidationPoint / _collateralAmount).toString();
  return price;
};

/**
 *  @param {BigNumber} baseChange
 * @param {BigNumber} fyTokenChange
 * @param {BigNumber} poolBaseReserves
 * @param {BigNumber} poolFyTokenReserves
 * @param {BigNumber} poolTotalSupply
 *
 * @returns {BigNumber[]} [newBaseReserves, newFyTokenRealReserves, newTotalSupply, newFyTokenVirtualReserves]
 */
export const newPoolState = (
  baseChange: BigNumber,
  fyTokenChange: BigNumber,
  poolBaseReserves: BigNumber,
  poolFyTokenReserves: BigNumber,
  poolTotalSupply: BigNumber
): {
  baseReserves: BigNumber;
  fyTokenRealReserves: BigNumber;
  totalSupply: BigNumber;
  fyTokenVirtualReserves: BigNumber;
} => {
  const newBaseReserves = poolBaseReserves.add(baseChange);
  const newFyTokenReserves = poolFyTokenReserves.add(fyTokenChange);
  const newTotalSupply = poolTotalSupply.add(fyTokenChange);
  const newFyTokenRealReserves = newFyTokenReserves.sub(newTotalSupply); // real = virtual - totalSupply
  return {
    baseReserves: newBaseReserves,
    fyTokenRealReserves: newFyTokenRealReserves,
    totalSupply: newTotalSupply,
    fyTokenVirtualReserves: newFyTokenReserves,
  };
};

/**
 *  @param {BigNumber} strategyTokenAmount
 * @param {BigNumber} strategyTotalSupply
 * @param {BigNumber} strategyPoolBalance
 * @param {BigNumber} poolBaseReserves
 * @param {BigNumber} poolFyTokenReserves
 * @param {BigNumber} poolTotalSupply
 * @param {number} poolTimeToMaturity
 * @param { BigNumber | string } ts
 * @param { BigNumber | string } g2
 * @param { number } decimals
 *
 * @returns {BigNumber} [fyTokenToBase, baseValue]
 */
export const strategyTokenValue = (
  strategyTokenAmount: BigNumber | string,
  strategyTotalSupply: BigNumber,
  strategyPoolBalance: BigNumber,
  poolBaseReserves: BigNumber,
  poolFyTokenReserves: BigNumber,
  poolTotalSupply: BigNumber,
  poolTimeToMaturity: string | BigNumber,
  ts: BigNumber | string,
  g2: BigNumber | string,
  decimals: number
): [BigNumber, BigNumber] => {
  // 0. Calc amount of lpTokens from strat token burn
  // 1. calc amount base/fyToken recieved from burn
  // 2. calculate new reserves (baseReserves and fyTokenReserevs)
  // 3. try trade with new reserves
  const lpReceived = burnFromStrategy(strategyPoolBalance, strategyTotalSupply!, strategyTokenAmount);
  const [_baseTokenReceived, _fyTokenReceived] = burn(
    poolBaseReserves,
    poolFyTokenReserves.sub(poolTotalSupply),
    poolTotalSupply,
    lpReceived
  );

  const newPool = newPoolState(
    _baseTokenReceived.mul(-1),
    _fyTokenReceived.mul(-1),
    poolBaseReserves,
    poolFyTokenReserves,
    poolTotalSupply
  );

  const sellValue = sellFYToken(
    newPool.baseReserves,
    newPool.fyTokenVirtualReserves,
    _fyTokenReceived,
    poolTimeToMaturity.toString(),
    ts,
    g2,
    decimals
  );

  return [sellValue, _baseTokenReceived];
};

/**
 * Calculates the estimated percentage of the pool given an inputted base amount.
 *
 * @param {BigNumber} input amount of base
 * @param {BigNumber} strategyTotalSupply strategy's total supply
 *
 * @returns {BigNumber}
 */
export const getPoolPercent = (input: BigNumber, strategyTotalSupply: BigNumber): string => {
  const input_ = new Decimal(input.toString());
  const totalSupply_ = new Decimal(strategyTotalSupply.toString());

  const ratio = input_.div(totalSupply_.add(input_));
  const percent = ratio.mul(new Decimal(100));

  return percent.toString();
};

/**
 * Calcualtes the MIN and MAX reserve ratios of a pool for a given slippage value
 *
 * @param {BigNumber} baseReserves
 * @param {BigNumber} fyTokenReserves
 * @param {number} slippage
 *
 * @returns {[BigNumber, BigNumber] }
 */
export const calcPoolRatios = (
  baseReserves: BigNumber,
  fyTokenReserves: BigNumber,
  slippage: number = 0.1
): [BigNumber, BigNumber] => {
  const baseReserves_ = new Decimal(baseReserves.toString());
  const fyTokenReserves_ = new Decimal(fyTokenReserves.toString());

  const slippage_ = new Decimal(slippage.toString());
  const wad = new Decimal(WAD_BN.toString());

  const ratio = baseReserves_.div(fyTokenReserves_).mul(wad);
  const ratioSlippage = ratio.mul(slippage_);

  const min = toBn(ratio.sub(ratioSlippage));
  const max = toBn(ratio.add(ratioSlippage));

  return [min, max];
};

/**
 * Calculate accrued debt value after maturity
 *
 * @param {BigNumber} rate
 * @param {BigNumber} rateAtMaturity
 * @param {BigNumberr} debt
 *
 * @returns {[BigNumber, BigNumber]} accruedDebt, debt less accrued value
 */
export const calcAccruedDebt = (rate: BigNumber, rateAtMaturity: BigNumber, debt: BigNumber): BigNumber[] => {
  const rate_ = new Decimal(rate.toString());
  const rateAtMaturity_ = new Decimal(rateAtMaturity.toString());
  const debt_ = new Decimal(debt.toString());

  const accRatio_ = rate_.div(rateAtMaturity_);
  const invRatio_ = rateAtMaturity_.div(rate_); // to reverse calc the debt LESS the accrued value

  const accruedDebt = !accRatio_.isNaN() ? debt_.mul(accRatio_) : debt_;
  const debtLessAccrued = debt_.mul(invRatio_);

  return [toBn(accruedDebt), toBn(debtLessAccrued)];
};
