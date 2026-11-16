import { createContext, useContext, useEffect, useState } from 'react';
import { fetchSiteData } from './api';

// Site-wide backend state: CMS content overrides + site register,
// fetched once from the Apps Script endpoint. `null` until loaded or when
// no backend is configured — components always fall back to bundled data.
const BackendContext = createContext({ content: {}, sites: null, ready: false });

export function BackendProvider({ children }) {
  const [state, setState] = useState({ content: {}, sites: null, ready: false });

  useEffect(() => {
    let live = true;
    fetchSiteData().then((data) => {
      if (!live || !data) {
        if (live) setState((s) => ({ ...s, ready: true }));
        return;
      }
      setState({
        content: data.content || {},
        sites: Array.isArray(data.sites) ? data.sites : null,
        ready: true,
      });
    });
    return () => { live = false; };
  }, []);

  return <BackendContext.Provider value={state}>{children}</BackendContext.Provider>;
}

export const useBackend = () => useContext(BackendContext);
