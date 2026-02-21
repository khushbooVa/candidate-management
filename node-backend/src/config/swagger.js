const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

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
            servers: [
                {
                    url: 'http://localhost:5000',
                    description: 'Development Server'
                },
                {
                    url: 'https://node-backend-e9lt0drys-khushboovas-projects.vercel.app',
                    description: 'Production Server'
                }
            ]
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
    apis: [path.join(__dirname, '../docs/swagger/*.js')] // Absolute path for Vercel
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
    swaggerUi,
    swaggerDocs
};
