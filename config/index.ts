export const sessionConfig = {
  secret: 'supermarketapp',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), //expires after two days
    maxAge: 1000 * 60 * 60 * 24 * 2,
  },
}
