# Betalife backend

REST API behind the [Betalife app](https://betalife-frontend.netlify.app). It stores events,
funding opportunities and announcements, and handles user and admin accounts with JWT auth.

Node.js + Express + MongoDB (Mongoose). No bundler, no framework magic — plain CommonJS modules.

## Stack

| Concern     | Choice                                              |
| ----------- | --------------------------------------------------- |
| Runtime     | Node.js 20.19+ (CI covers 20, 22 and 24)            |
| HTTP        | Express 5                                           |
| Database    | MongoDB via Mongoose 9                              |
| Auth        | `jsonwebtoken` (bearer tokens) + `bcrypt` hashing    |
| Validation  | `joi` schemas applied as middleware                  |
| Logging     | `pino` structured JSON logs                          |
| Tests       | Jest + Supertest + `mongodb-memory-server`           |

## Project layout

```
src/
  app.js              Express app: middleware, routes, error handling (no DB connection)
  index.js            Process entry point: config check, DB connect, HTTP server, shutdown
  db.js               Mongoose connect/disconnect helpers
  config/             Environment parsing and fail-fast validation
  routes/             Route tables; attach auth, uploads and validation middleware
  controllers/        Request/response translation only
  services/           Password hashing, token issuing, account reads and writes
  models/             Mongoose schemas and indexes
  middleware/         auth, validation, upload, request logging, error handling
  utils/              crudFactory, asyncHandler, HttpError, logger
  validation/         Joi schemas for every writable endpoint
__tests__/            Jest suites plus database and token helpers
```

Layering is deliberate: routes decide who may call an endpoint, controllers shape the HTTP
response, services own the business rules, models own persistence. Anything shared by several
collections lives in `src/utils` instead of being copy-pasted into each controller.

## Getting started

You need Node.js 20.19 or newer and a MongoDB instance (local or Atlas).

```bash
npm install
cp .env.example .env      # then edit the values
npm run dev               # nodemon on http://localhost:4000
```

Without nodemon use `npm start`. The server refuses to boot if `STRING` or `JWT_SECRET` is
missing, so a misconfigured deploy fails immediately instead of erroring on the first request.

### Environment variables

| Name             | Required | Default       | Purpose                                          |
| ---------------- | -------- | ------------- | ------------------------------------------------ |
| `STRING`         | yes      | –             | MongoDB connection string                        |
| `JWT_SECRET`     | yes      | –             | Secret used to sign and verify access tokens     |
| `PORT`           | no       | `4000`        | HTTP port                                        |
| `NODE_ENV`       | no       | `development` | `production` enables production behaviour        |
| `JWT_EXPIRES_IN` | no       | `24h`         | Token lifetime                                   |
| `LOG_LEVEL`      | no       | `info`        | Pino log level (`silent` in tests)               |

## API

All request and response bodies are JSON. Timestamps are ISO 8601. Routes marked with a
token need an `Authorization: Bearer <token>` header.

| Method | Path                            | Auth  | Description                          |
| ------ | ------------------------------- | ----- | ------------------------------------ |
| GET    | `/`                             | –     | Service banner                       |
| GET    | `/health`                       | –     | Health probe with DB `readyState`    |
| GET    | `/api/events`                   | –     | List events                          |
| GET    | `/api/events/:id`               | –     | Single event                         |
| POST   | `/api/events`                   | token | Create an event (multipart allowed)  |
| PUT    | `/api/events/:id`               | token | Update an event (multipart allowed)  |
| DELETE | `/api/events/:id`               | token | Delete an event                      |
| GET    | `/api/funds`                    | –     | List funding opportunities           |
| GET    | `/api/funds/:id`                | –     | Single funding opportunity           |
| POST   | `/api/funds`                    | token | Create a funding opportunity         |
| PUT    | `/api/funds/:id`                | token | Update a funding opportunity         |
| DELETE | `/api/funds/:id`                | token | Delete a funding opportunity         |
| GET    | `/api/announcement`             | –     | List announcements                   |
| GET    | `/api/announcement/:id`         | –     | Single announcement                  |
| POST   | `/api/announcement`             | token | Create an announcement               |
| PUT    | `/api/announcement/:id`         | token | Update an announcement               |
| DELETE | `/api/announcement/:id`         | token | Delete an announcement               |
| POST   | `/api/auth/signup`              | –     | Register a user                      |
| POST   | `/api/auth/login`               | –     | User login, returns profile + token  |
| PUT    | `/api/auth/updateUser/:id`      | token | Update a user profile                |
| POST   | `/api/auth/admin/signup`        | –     | Register an admin (needs `role: admin`) |
| POST   | `/api/auth/admin/login`         | –     | Admin login, returns profile + token |
| PUT    | `/api/auth/admin/updateAdmin/:id` | token | Update an admin profile            |
| POST   | `/images`                       | –     | Upload an image (`image` field)      |
| GET    | `/images/:filename`             | –     | Serve an uploaded image              |

### Responses and errors

Successful writes return a short confirmation, for example `{ "message": "Event post successful!" }`.
Reads return the stored document(s). Every failure uses the same shape:

```json
{ "message": "Invalid request payload.", "details": [{ "field": "email", "message": "\"email\" must be a valid email" }] }
```

`details` is only present for validation failures. Unexpected server errors are logged with the
full stack and answered with a generic `Oops! Something went wrong.` so internals never leak.

| Status | When                                              |
| ------ | ------------------------------------------------- |
| 400    | Validation failed, malformed id or JSON           |
| 401    | Missing/invalid token, wrong credentials          |
| 404    | Resource does not exist                           |
| 409    | Duplicate unique value (for example an email)     |
| 500    | Unexpected failure                                |

## Tests

```bash
npm test            # jest
npm run test:cover  # jest with coverage, enforces the thresholds in jest.config.js
```

Suites boot a real MongoDB in memory through `mongodb-memory-server`, so no Atlas credentials
or network access are needed. Each suite gets a clean database, model indexes are created
before assertions run, and the app is imported without connecting to anything.

The test scripts enable `--experimental-vm-modules`: the MongoDB driver loads its `os` adapter
with a dynamic `import()`, which the default Jest sandbox cannot resolve.

Coverage is collected from `src/` (excluding the bootstrap file) and CI fails below the global
thresholds. Add a test with every behaviour change.

## Scripts

| Script               | What it does                                     |
| -------------------- | ------------------------------------------------ |
| `npm start`          | Run the API with Node                            |
| `npm run dev`        | Run with nodemon                                 |
| `npm test`           | Run Jest                                         |
| `npm run test:cover` | Jest with coverage thresholds                    |
| `npm run lint`       | ESLint over `src` and `__tests__`                |
| `npm run format`     | Prettier write                                   |
| `npm run format:check` | Prettier check (used by CI)                    |
| `npm run audit`      | `npm audit --audit-level=high`                   |

Pre-commit hooks run ESLint and Prettier on staged files via husky + lint-staged.

## Docker

```bash
docker compose up --build
```

The compose file starts the API on port 4000 plus a MongoDB instance. To build the image alone:

```bash
docker build -t betalife-backend .
docker run -p 4000:4000 -e STRING=mongodb://host:27017/betalife -e JWT_SECRET=... betalife-backend
```

## Deployment

`Procfile` still runs `node src/index.js`. Set `STRING`, `JWT_SECRET` and `NODE_ENV=production`
on the platform; everything else has a default. Logs are emitted as JSON on stdout, which
Heroku, Render, Fly and friends collect without extra configuration.

## CI

`.github/workflows/backend.yml` runs on pushes and pull requests to `develop` and `master`:

1. `npm ci` with npm caching,
2. lint and format check,
3. the test suite with coverage enforced,
4. `npm audit --audit-level=high` in a separate job.

Dependabot (`.github/dependabot.yml`) opens weekly dependency PRs and monthly action bumps.

## Contributing

Keep changes small and pair them with tests. One behaviour per commit, `npm test` green before
pushing, and update this README whenever a script, environment variable or endpoint changes.

## Licence

MIT — see [LICENSE](./LICENSE).
