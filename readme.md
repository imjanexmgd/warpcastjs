# warpcastjs

a tool for automation at https://www.warpcast.com
do with your own risk

## Requirements

-  node js

## List Service

1. Follow Channel By Fid

## Setup account

-  see acc.example.json and copy to new file with name acc.json
-  format acc.json must be

```
[
   {
      "username": "username",
      "token": "Bearer MK-dsfkodsfodfo=="
   },
   {
      "username": "username2",
      "token": "Bearer MK-dsfkodsfodfo2=="
   }
]
```

you can obtain bearer token from https://warpcast.com
its support multi account

## How to use

-  Install package

```
   npm install
```

-  Run index.js

```
  node index,js
```
