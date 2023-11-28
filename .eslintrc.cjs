module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    parserOptions: {
        ecmaVersion: 'latest', // Asegúrate de que esta versión soporta ESM
        sourceType: 'module', // Importante para ESM
    },
    plugins: ['bot-whatsapp'],
    extends: ['plugin:bot-whatsapp/recommended'],
    // Overrides solo si es necesario para casos específicos
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script' // Solo si estos archivos no usan ESM
            },
        },
    ],
};
