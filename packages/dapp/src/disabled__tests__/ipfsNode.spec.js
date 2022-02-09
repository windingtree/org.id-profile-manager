import './fixJsDomEnv';
import { renderHook, act } from '@testing-library/react-hooks';
import { IPFS } from '@windingtree/ipfs-apis';
import { useIpfsNode } from '../hooks/useIpfsNode';

test('Tests useIpfsNode react hook', async () => {
  const { result } = renderHook(() => useIpfsNode(true));

  expect(result.current[0]).toBe(undefined);
  expect(typeof result.current[1]).toBe('function');
  expect(typeof result.current[2]).toBe('function');
  expect(result.current[3]).toBe(false);
  expect(result.current[4]).toBe(undefined);

  await act(() => result.current[1]());

  console.log('%%%%%%%%%>>>', result.current);
  expect(result.current[0] && result.current[0] instanceof IPFS).toBe(true);
  expect(result.current[3]).toBe(true);
  expect(result.current[4]).toBe(undefined);
});
