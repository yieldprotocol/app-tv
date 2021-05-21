import { useEffect, useState, useContext } from 'react';
import { ChainContext } from '../contexts/ChainContext';

export const useTimeTravel = () => {
  const { chainState: { fallbackProvider } } = useContext(ChainContext);

  const [snapshotNumber, setSnapshotNumber] = useState<any>('0x1');
  const [block, setBlock] = useState<any>(null);
  const [timestamp, setTimestamp] = useState<number|null>(null);

  useEffect(() => {
    fallbackProvider && (async () => {
      const { timestamp: ts } = await fallbackProvider.getBlock('latest');
      setTimestamp(ts);

      console.log(ts);
    })();
  }, [block, fallbackProvider]);

  const takeSnapshot = async () => {
    const res = await fetch('http://localhost:8545', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{"id":31337,"jsonrpc":"2.0","method":"evm_snapshot","params":[]}',
    });
    const num = await res.json();
    // eslint-disable-next-line no-console
    console.log('Snapshot taken', num.result);
    setSnapshotNumber(num.result);
    window.localStorage.setItem('snapshot', num.result);
    setBlock(fallbackProvider.blockNumber);
  };

  const revertToSnapshot = async () => {
    const res = await fetch('http://localhost:8545', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: `{"id":31337,"jsonrpc":"2.0","method":"evm_revert","params":["${window.localStorage.getItem('snapshot')}"]}`,
    });
      // eslint-disable-next-line no-console
    console.log('Reverted to Snapshot', (await res.json()).result);
    takeSnapshot();
    setBlock(fallbackProvider.blockNumber);
    window.localStorage.clear();
    window.location.reload();
  };

  const revertToT0 = async () => {
    const res = await fetch('http://localhost:8545', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{"id":31337,"jsonrpc":"2.0","method":"evm_revert","params":["0x1"]}',
    });
      // eslint-disable-next-line no-console
    console.log('Reverted to first snapshot', (await res.json()).result);
    takeSnapshot();
    setBlock(fallbackProvider.blockNumber);
    window.localStorage.clear();
    window.location.reload();
  };

  const advanceTime = async (time:string) => {
    const res = await fetch('http://localhost:8545', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: `{"id":31337,"jsonrpc":"2.0","method":"evm_increaseTime","params":[${time}]}`,
    });
      // eslint-disable-next-line no-console
    console.log(await res.json());
    setBlock(fallbackProvider.blockNumber);
    window.location.reload();
  };

  const advanceBlock = async () => {
    const res = await fetch('http://localhost:8545', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{"id":31337,"jsonrpc":"2.0","method":"evm_mine","params":[]}',
    });
      // eslint-disable-next-line no-console
    console.log(await res.json());
    setBlock(fallbackProvider.blockNumber);
    // eslint-disable-next-line no-console
    console.log('new block:', fallbackProvider.blockNumber);
  };

  const advanceTimeAndBlock = async (time:string) => {
    await advanceTime(time);
    await advanceBlock();
  };

  return {
    advanceTimeAndBlock,
    revertToSnapshot,
    takeSnapshot,
    snapshotNumber,
    revertToT0,
    block,
    timestamp,
  } as const;
};
