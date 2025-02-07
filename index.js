const fastify = require('fastify')({ logger: true })

// Declare a route
fastify.post('/analytics', async (request, reply) => {
  console.log(request.body);
  return reply.status(200).send(request.body);
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
