export const ORDER_STATUS: {
  [index: number]: { label: string; color: string }
} = {
  0: {
    label: 'Pending',
    color: 'primary',
  },
  1: {
    label: 'Processing',
    color: 'info',
  },
  2: {
    label: 'Shipped',
    color: 'warning',
  },
  3: {
    label: 'Delivered',
    color: 'success',
  },
  4: {
    label: 'Failed',
    color: 'danger',
  },
}
