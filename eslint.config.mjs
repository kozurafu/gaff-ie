import next from 'eslint-config-next';

export default [
  {
    ignores: ['node_modules', '.next', 'out', 'dist'],
  },
  ...next,
  {
    rules: {
      'react-hooks/static-components': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
    },
  },
];
