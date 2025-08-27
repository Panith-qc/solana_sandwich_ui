export const JUP_BASE =
  import.meta.env.MODE === 'development'
    ? '/api/jupiter'
    : 'https://quote-api.jup.ag/v6'
