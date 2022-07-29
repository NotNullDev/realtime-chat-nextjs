# Commands

```shell
npx prisma migrate dev --name init


npx prisma migrate dev
# generate prisma client
npx prisma generate

npx prisma migrate dev --create-only
# edit sql file, then apply
npx prisma migrate dev

# prisma studio
npx prisma studio

```

## Supabase

```shell
# init
supabase init
# run locally (docker images)
supabase start
```

## Used technologies

- [DaisyUI](https://daisyui.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [HeroIcons](https://heroicons.com/)
- [Prisma](https://www.prisma.io/)
- [Pusher](https://pusher.com/)

# TODO

- [x] Add websocket support
- [ ] Reduce calls to the database (add caching)
