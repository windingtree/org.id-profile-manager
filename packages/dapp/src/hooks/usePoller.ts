import { useEffect } from 'react';

import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('usePoller');

// usePoller react hook
export const usePoller = (
  fn: Function,
  delay: number | null,
  enabled = true,
  name = ' '
): void => {

  useEffect(() => {
    let isFnDone = true;

    const fnRunner = async () => {
      if (isFnDone) {
        const context = fn();

        if (typeof context.then === 'function') {
          isFnDone = false;
          await context;
          isFnDone = true;
        }

        isFnDone = true;
      }
    };

    if (enabled && delay) {
      // @todo add promise watcher
      const id1 = setInterval(fnRunner, delay);
      const id0 = setTimeout(fnRunner);
      logger.debug(`Poller ${name} started`);

      return () => {
        clearTimeout(id0);
        clearInterval(id1);
        logger.debug(`Poller ${name} stopped`);
      };
    }
  }, [fn, delay, name, enabled]);
};
