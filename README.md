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
- [ ] Reduce calls to the database (add caching?)
- [ ] Message should be added instantly with NOT_SYNC status, then after sync it should be changed to SYNC status
- [ ] Add heartbeat to the websocket
- [ ] Add private rooms support
- [ ] Use planetscale as production database provider
- [ ] Deploy first version on vercel
- [ ] Add tests
- [ ] Add channels
- [ ] Add excalidraw to the site

# Bugs

- [ ] Textarea is not cleared if you press enter many times
- [ ] Message is not added to the char randomly (seems like prisma is not committing changes?)
