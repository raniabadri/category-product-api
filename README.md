# Category & Product Management API

## Setup
1. `npm install`
2. Configure `.env` with Neon PostgreSQL URL
3. `npx prisma migrate dev`
4. `npm run start:dev`

## Endpoints
- **Categories**: `POST /category`, `GET /category`, `PUT /category/:id`, `DELETE /category/:id`
- **Products**: `POST /product`, `GET /product`, `GET /product/:id`, `PUT /product/:id`, `DELETE /product/:id`, `GET /product/search`
- **Product Items**: `POST /product-item`, `GET /product-item`, `GET /product-item/:id`, `PUT /product-item/:id`, `DELETE /product-item/:id`

## Notes
- Multilingual support (Arabic, English, French).
- Search by name and price filters implemented.