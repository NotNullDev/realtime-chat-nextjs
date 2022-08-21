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

# generate NEXTAUTH_SECRET
openssl rand -base64 32


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
- [x] Reduce calls to the database (add caching?)
- [x] Message should be added instantly with NOT_SYNC status, then after sync it should be changed to SYNC status
- [x] Use planetscale as production database provider
- [x] Deploy first version on vercel
- [x] Add excalidraw to the site
- [ ] Add channels
- [ ] Add User profile
- [x] Add anonymous user support
- [ ] Add user avatar support
- [ ] Add option to resize canvas to chat ratio in the room
- [x] Add private rooms support
- [ ] Add 
- [ ] Add tests

- [ ] Add live collaboration support to the exaclidraw

# Bugs

- [ ] Textarea is not cleared if you press enter many times
- [x] Message is not added to the char randomly (seems like prisma is not committing changes?)
