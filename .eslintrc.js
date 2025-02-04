module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Disable the specific rule related to useSearchParams warning
    'nextjs/no-missing-suspense-with-csr-bailout': 'off',
  },
};
