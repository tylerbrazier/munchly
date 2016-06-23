module.exports = {
  http: {
    port: 8080,
  },
  https: {
    port: 8443,
    // relative to the tls directory
    key: 'dev.key.pem',
    cert: 'dev.cert.pem',
  },
  admin: {
    user: 'root',
    password: 'root',
  },
  db: "mongodb://localhost/test",
}
