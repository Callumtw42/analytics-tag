require('dotenv').config()
const fastify = require('fastify')({ 
    logger: true,
    // Enable body parsing
    bodyLimit: 1048576 // 1MiB
})

async function testBQ() {
    const {BigQuery} = require('@google-cloud/bigquery');

    // Create client instance
    const bigqueryClient = new BigQuery({
        projectId: process.env.GOOGLE_CLOUD_PROJECT,
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });

    try {
        const sqlQuery = `SELECT * FROM \`analytics-450210.page_log.analytics_table\` LIMIT 10`;
        const options = {
            query: sqlQuery,
            location: 'EU',
        };

        // Run the query
        const [rows] = await bigqueryClient.query(options);
        console.log('Query successful');
        return rows;
    } catch (error) {
        console.error('BigQuery Error:', error);
        throw error;
    }
}

// Register CORS plugin
fastify.register(require('@fastify/cors'), {
    origin: '*',
    methods: ['POST']
})

// Register JSON parser
fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
    try {
        const json = JSON.parse(body)
        done(null, json)
    } catch (err) {
        err.statusCode = 400
        done(err, undefined)
    }
})

// Declare a route
fastify.post('/analytics', async (request, reply) => {
    try {
        console.log('Received body:', request.body);  // Debug log
        const data = await testBQ();
        return {
            status: 'success',
            data,
        }
    }
    catch (err) {
        console.error('Error:', err);  // Debug log
        return reply.code(500).send({
            status: 'error',
            message: err.message
        });
    }
})

fastify.post('/pageLog', async (request, reply) => {
    console.log('Received body:', request.body);  // Debug log
    return reply.code(200).send(request.body);
});

// Run the server!
const start = async () => {
    try {
        await fastify.listen({ port: 3000 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start();
