FROM oven/bun:1.2.2
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY prisma ./prisma
RUN bunx prisma generate

COPY . .

CMD ["bun", "run", "start"]