const prettyPrint = (data) => {
    // Convert to formatted JSON string first
    const formatted = JSON.stringify(data, null, 2);

    // Add colors using ANSI escape codes
    const colorized = formatted.replace(/"([^"]+)":/g, '\x1b[36m"$1":\x1b[0m')  // cyan for keys
        .replace(/: "([^"]+)"/g, ': \x1b[32m"$1"\x1b[0m')  // green for string values
        .replace(/: (true|false)/g, ': \x1b[33m$1\x1b[0m')  // yellow for booleans
        .replace(/: (\d+)/g, ': \x1b[34m$1\x1b[0m');  // blue for numbers

    console.log(colorized);
}

require('dotenv').config();
const fastify = require('fastify')({
    logger: true,
    // Enable body parsing
    bodyLimit: 1048576 // 1MiB
})

async function testBQ() {
    const { BigQuery } = require('@google-cloud/bigquery');

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
        console.log('\n🔍 Received Query Request:');
        prettyPrint(request.body);
        const data = await testBQ();
        return {
            status: 'success',
            data,
        }
    }
    catch (err) {
        console.error('Error:', err);
        return reply.code(500).send({
            status: 'error',
            message: err.message
        });
    }
})

fastify.post('/pageLog', async (request, reply) => {
    console.log('\n📊 Received Analytics Data:');
    const data = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    prettyPrint(data);

    // Fetch location data using IP-API
    const locationResponse = await fetch(`http://ip-api.com/json/${data.ip}`);
    const locationData = await locationResponse.json();

    data.location = {
        country: locationData.country || null,
        region: locationData.regionName || null,
        city: locationData.city || null,
        town: locationData.city || null, // IP-API doesn't provide town specifically
        org: locationData.org || null,
    };
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
