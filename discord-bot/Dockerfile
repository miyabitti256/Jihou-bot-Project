FROM oven/bun:1.3.9
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY prisma ./prisma
RUN bunx prisma generate

COPY . .

CMD ["bun", "run", "start"]