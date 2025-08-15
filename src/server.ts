import { app } from "./app.ts"

app.listen({ port: 3000 }, function (err, address) {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }

  console.log(`🚀 Server is now listening on ${address}`)
})