const state = reactive({
  show: false,
  title: '',
  content: '',
  okText: 'Confirm',
  cancelText: 'Cancel',
})

let close: (msg: string) => void

function open(opts?: any): Promise<string> {
  state.show = true
  Object.assign(state, opts)
  return new Promise((resolve) => (close = resolve))
}

function reset() {
  state.show = false
  state.title = ''
}

function confirm() {
  reset()
  close('confirm')
}

function cancel() {
  reset()
  close('cancel')
}

export function useDialog() {
  return {
    state,
    open,
    confirm,
    cancel,
  }
}
