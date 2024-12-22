import { useState } from 'react'

interface PaginationState {
  pageIndex: number
  pageSize: number
}

interface SetPaginationParams {
  pageIndex: number
  pageSize?: number
}

export function usePagination(initialState: PaginationState = { pageIndex: 0, pageSize: 10 }) {
  const [state, setState] = useState<PaginationState>(initialState)

  const setPagination = (params: SetPaginationParams) => {
    setState((prev) => ({
      ...prev,
      ...params,
    }))
  }

  return {
    ...state,
    setPagination,
  }
} 