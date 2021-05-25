# discord trollbot 
##### Currently just a fancy tracker
##### Was ragequit... now it's a salt tracker

## Run the troll bot:
- From src/ => npm run start-dev or npm run start (for prod)
  - These can be run simultaneously on the same discord server.
  - Prod uses '!' as the prefix, dev uses '('
  - Dev is not working right now, so we just dev/test on prod. Ef it.
- Ensure that a mysql server is running and has the following:
  - Appropriate tables built (run all of the sql files in order in src/db)
  - Discord user with access only to the discord schema
- From server => nodemon server.js

## PM2
- I use PM2 for process management on production
- For Discordbot (in /src):
```
pm2 start npm -- start

```
- For the server (/server):
```
pm2 start server.js --watch
```