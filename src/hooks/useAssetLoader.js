import { useState, useEffect } from 'react';
import assetLoader from '../utils/AssetLoadingManager';

/**
 * Custom React hook for progressive asset loading state
 */
export function useAssetLoader() {
  const [loadingState, setLoadingState] = useState(() => assetLoader.getState());

  useEffect(() => {
    // Start loader pipeline if not already running
    assetLoader.start();

    // Subscribe to progress and reveal state changes
    const unsubscribe = assetLoader.subscribe(setLoadingState);
    return () => unsubscribe();
  }, []);

  return loadingState;
}

export default useAssetLoader;
