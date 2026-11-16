import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchWithTimeout } from '../utils/http';

describe('utils/http', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('resolves when fetch completes before timeout', async () => {
    const mockResponse = new Response(JSON.stringify({ ok: true }), { status: 200 });
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse);

    const res = await fetchWithTimeout('https://example.com/api', { method: 'GET' }, 5000);

    expect(res.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0]?.[1]?.signal).toBeInstanceOf(AbortSignal);
  });

  it('aborts request when timeout elapses', async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, 'fetch').mockImplementation((_input, init) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException('The operation was aborted.', 'AbortError'));
        });
      });
    });

    const promise = fetchWithTimeout('https://example.com/slow', {}, 1000);
    const assertion = expect(promise).rejects.toThrow(/aborted/i);

    await vi.advanceTimersByTimeAsync(1000);
    await assertion;
  });
});
