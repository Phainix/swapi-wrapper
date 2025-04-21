# 🛰️ SWAPI Wrapper (NestJS)

A Star Wars API (SWAPI) wrapper built with [NestJS](https://nestjs.com/).

---

## 🚀 Features

- 🔁 **Proxy to SWAPI** endpoints like `/people`, `/planets`, etc.
- ⚡ **In-memory caching** (5-minute TTL) to reduce redundant requests.
- 📄 **Pagination metadata** included with listings.
- 🔒 **Rate limiting** to prevent abuse (default: 10 req/min per IP).
- 🧪 **Unit-tested** core services.

---

## 🛠️ Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **HTTP Client:** Axios via `@nestjs/axios`
- **Cache:** `@nestjs/cache-manager` (in-memory)
- **Rate Limiting:** `@nestjs/throttler`
- **Testing:** Jest + ts-jest

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/Phainix/swapi-wrapper.git
cd swapi-wrapper

# Install dependencies
yarn install
```

---

## 🧪 Run the App

```bash
yarn start:dev
```

---

## 🧪 Run Tests

```bash
yarn test
```

---

## 📘 Example Endpoints

• GET /people?page=1
→ Paginated list of people.
• GET /people/:id
→ Person details (with resolved homeworld, starships, etc).
• GET /planets?page=1
→ Paginated list of planets.
• GET /planets/:id
→ Planet details (with resolved residents and films).
