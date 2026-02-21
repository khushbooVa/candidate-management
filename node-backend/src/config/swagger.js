const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Hiring Process Simplifier API',
            version: '1.0.0',
            description: 'API Documentation for the Candidate Management System',
            contact: {
                name: 'Developer'
            },
            servers: [{
                url: 'http://localhost:5000',
                description: 'Development Server'
            }]
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./src/docs/swagger/*.js'] // Paths to files containing OpenAPI annotations
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
    swaggerUi,
    swaggerDocs
};
