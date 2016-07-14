module.exports = {
  http: {
    port: 8080,
  },
  https: {
    port: 8443,
    key: 'tls/key.pem',
    cert: 'tls/cert.pem',
  },
  admin: {
    user: 'root',
    password: 'root',
  },
  db: "mongodb://localhost/test",
}
