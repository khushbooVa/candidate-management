const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger.json');

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

module.exports = {
    swaggerUi,
    swaggerDocs,
    swaggerUiOptions: {
        customCssUrl: CSS_URL,
        customJs: [
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-bundle.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-standalone-preset.min.js"
        ]
    }
};
