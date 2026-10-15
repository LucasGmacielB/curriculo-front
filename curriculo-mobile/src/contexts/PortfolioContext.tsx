import { isAxiosError } from 'axios';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import { getApiErrorMessage, getCurriculo, getPessoas, isCanceledRequest } from '@/services/api';
import type { Curriculo, Pessoa } from '@/types/portfolio';

interface PortfolioState {
  pessoas: Pessoa[];
  curriculo: Curriculo | null;
  selectedId: number | null;
  pendingId: number | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

export interface PortfolioContextValue extends PortfolioState {
  selectProfile: (id: number) => Promise<void>;
  retry: () => Promise<void>;
  refresh: () => Promise<void>;
}

type RequestAction = { type: 'profiles'; refresh: boolean } | { type: 'profile'; id: number };

export const PortfolioContext = createContext<PortfolioContextValue | undefined>(undefined);

const initialState: PortfolioState = {
  pessoas: [],
  curriculo: null,
  selectedId: null,
  pendingId: null,
  isLoading: true,
  isRefreshing: false,
  error: null,
};

export function PortfolioProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<PortfolioState>(initialState);
  const selectedIdRef = useRef<number | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const requestTokenRef = useRef(0);
  const mountedRef = useRef(false);
  const retryActionRef = useRef<RequestAction>({ type: 'profiles', refresh: false });

  const performRequest = useCallback(async (action: RequestAction): Promise<void> => {
    if (!mountedRef.current) return;

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const token = ++requestTokenRef.current;
    const isCurrentRequest = () => mountedRef.current && token === requestTokenRef.current;
    const refreshing = action.type === 'profiles' && action.refresh;
    retryActionRef.current = action;

    setState((previous) => ({
      ...previous,
      pendingId: action.type === 'profile' ? action.id : selectedIdRef.current,
      isLoading: !refreshing,
      isRefreshing: refreshing,
      error: null,
    }));

    try {
      let targetId: number;

      if (action.type === 'profiles') {
        const pessoas = await getPessoas(controller.signal);
        if (!isCurrentRequest()) return;

        if (pessoas.length === 0) {
          selectedIdRef.current = null;
          setState({
            pessoas: [],
            curriculo: null,
            selectedId: null,
            pendingId: null,
            isLoading: false,
            isRefreshing: false,
            error: null,
          });
          return;
        }

        const selected = pessoas.find((pessoa) => pessoa.id === selectedIdRef.current);
        targetId = (selected ?? pessoas[0]).id;
        setState((previous) => ({ ...previous, pessoas, pendingId: targetId }));
      } else {
        targetId = action.id;
      }

      const curriculo = await getCurriculo(targetId, controller.signal);
      if (!isCurrentRequest()) return;

      // Commit the identity and content together; a failed switch keeps the previous profile.
      selectedIdRef.current = targetId;
      setState((previous) => ({
        ...previous,
        curriculo,
        selectedId: targetId,
        pendingId: null,
        isLoading: false,
        isRefreshing: false,
        error: null,
      }));
    } catch (error: unknown) {
      if (!isCurrentRequest() || isCanceledRequest(error)) return;
      if (isAxiosError(error) && error.response?.status === 404) {
        retryActionRef.current = { type: 'profiles', refresh: false };
      }
      setState((previous) => ({
        ...previous,
        isLoading: false,
        isRefreshing: false,
        error: getApiErrorMessage(error),
      }));
    } finally {
      if (isCurrentRequest()) controllerRef.current = null;
    }
  }, []);

  const selectProfile = useCallback(
    (id: number) => performRequest({ type: 'profile', id }),
    [performRequest],
  );
  const retry = useCallback(() => performRequest(retryActionRef.current), [performRequest]);
  const refresh = useCallback(
    () => performRequest({ type: 'profiles', refresh: true }),
    [performRequest],
  );

  useEffect(() => {
    mountedRef.current = true;
    void performRequest({ type: 'profiles', refresh: false });

    return () => {
      mountedRef.current = false;
      requestTokenRef.current += 1;
      controllerRef.current?.abort();
      controllerRef.current = null;
    };
  }, [performRequest]);

  const value = useMemo<PortfolioContextValue>(
    () => ({ ...state, selectProfile, retry, refresh }),
    [state, selectProfile, retry, refresh],
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}
