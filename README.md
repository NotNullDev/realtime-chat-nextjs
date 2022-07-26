# Commands

```shell
npx prisma migrate dev --name init


npx prisma migrate dev
# generate prisma client
npx prisma generate

npx prisma migrate dev --create-only
# edit sql file, then apply
npx prisma migrate dev
```

## Supabase
```shell
# init
supabase init
# run locally (docker images)
supabase start
```

# TODO

- [ ] Add websocket support
- [ ] Reduce calls to the database (add caching)
