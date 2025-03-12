"use client"

import * as React from "react"

import { Toast, ToastActionElement, ToastProvider } from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

let TOAST_ID = 0

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
}

let listeners = []
let memoryState = { toasts: [] }

function dispatch(action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.id
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }

    case actionTypes.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      }

    default:
      return state
  }
}

function useToast() {
  const [state, setState] = React.useState(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast: (props) => {
      const id = String(TOAST_ID++)
      const toast = {
        ...props,
        id,
        open: true,
        onOpenChange: (open) => {
          if (!open) dismiss(id)
        },
      }

      dispatch({
        type: actionTypes.ADD_TOAST,
        toast,
      })

      return id
    },
    update: (id, props) => {
      dispatch({
        type: actionTypes.UPDATE_TOAST,
        id,
        toast: props,
      })
    },
    dismiss: (id) => {
      dispatch({ type: actionTypes.DISMISS_TOAST, id })
    },
  }
}

function toast(props) {
  const id = String(TOAST_ID++)

  const update = (props) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      id,
      toast: props,
    })

  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, id })

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function dismiss(toastId) {
  dispatch({
    type: actionTypes.DISMISS_TOAST,
    id: toastId ?? "",
  })
}

export { useToast, toast, dismiss }