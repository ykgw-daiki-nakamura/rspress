module.exports = {
    // '*.{js,jsx,ts,tsx}': [
    //   'eslint --fix',
    //   'prettier --write',
    // ],
    '*.md': [
        'markdownlint --fix',
        'markdownlint',
        'textlint --fix',
        'textlint',
        'prettier --write'
      ],
      '*.txt': [
        'textlint --fix',
        'textlint',
        'prettier --write'
      ]
  };
  