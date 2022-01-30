import { useEffect } from 'react';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('usePoller');

// usePoller react hook
export const usePoller = (
  fn: Function,
  delay: number | null,
  enabled = true,
  name = ' ',
  maxFailures = 100
): void => {

  useEffect(() => {
    let failures = 0;

    const fnRunner = async (): Promise<void> => {
      try {
        const context = fn();

        if (typeof context.then === 'function') {
          await context;
        }
      } catch (error) {
        failures++;
        logger.error(
          `Poller ${name} error: ${(error as Error).message || 'Unknown error'}`
        );
      }
    };

    const isEnabled = () => enabled && delay && failures < maxFailures;

    const poller = async (): Promise<void> => {
      logger.debug(`Poller ${name} started`);

      while (isEnabled()) {
        await fnRunner();
        await new Promise(
          resolve => setTimeout(resolve, delay !== null ? delay : 0)
        );
      }
    };

    let runnerTimeout: NodeJS.Timeout | undefined;

    if (isEnabled()) {
      runnerTimeout = setTimeout(poller);
    }

    return () => {
      clearTimeout(runnerTimeout as NodeJS.Timeout);
      logger.debug(`Poller ${name} stopped`);
    };
  }, [fn, delay, name, enabled, maxFailures]);
};
