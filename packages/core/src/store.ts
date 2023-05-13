export type Listener<TState> = (currentState: TState) => void

export function createStore<TState>(initialState: TState) {
  const listeners = new Set<Listener<TState>>()
  const state: TState = initialState

  const update = (updatedState: Partial<TState>) => {
    // @ts-ignore
    Object.assign(state, updatedState)
    listeners.forEach((listener) => listener(state))
  }

  const subscribe = (listener: Listener<TState>) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  const cleanup = () => listeners.clear()

  const getState = () => state

  return {
    update,
    subscribe,
    cleanup,
    getState,
  }
}
