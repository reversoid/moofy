module.exports = {
    root: true,
    plugins: ['import'],
    overrides: [
      {
        files: ["*.ts"],
        parserOptions: {
          project: [
            "./new-frontend/tsconfig.json",
          ],
          createDefaultProgram: true
        },
        extends: [
            "plugin:@angular-eslint/recommended",
            'airbnb-typescript/base',
            'prettier',
            'plugin:prettier/recommended'
        ],
        rules: {}
      },
      {
        files: ["*.component.html"],
        extends: ["plugin:@angular-eslint/template/recommended"],
        rules: {
          "max-len": ["error", { "code": 140 }]
        }
      },
      {
        files: ["*.component.ts"],
        extends: ["plugin:@angular-eslint/template/process-inline-templates"]
      }
    ],
  }