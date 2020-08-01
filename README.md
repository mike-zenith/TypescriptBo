TypescriptBo
===

AKA how to over-complicated a simple application just because you can in about ~8hrs.

Based on a [similar project: HaiBoO](https://github.com/mike-zenith/haiboo)

Concepts and rules are the same, please check the `README.md` file over there.

### Reasons

Low-complexity challenges do not reveal anything. 

### Business related differences 
- Server does not listen on any ports (not started)
- Frontend not started
- Only finished create endpoint, it also lacks feature that should be added: handling already existing production
    - this is missing from every layer
- No properly formatted errors
- No input schema validation / no API blueprint

### Technical differences
- Bootstrapped with
    - Typescript, Jest
    - ESLint, prettier
- TDD inside-out, clean architecture
- Strict, defensive OOP
- Not counting missing features, 100% code coverage, maintainable tests
- Questionable:
    - Used a sledgehammer to crack a nut
    - Domain entity factory could be extracted
    - Massive test count due to presenting the approach and issues
    - Typesafe validation needed more tests (and still needs a few tbh)
    - Request body transformation could be moved to action (arguably)

### Setup

docker-compose for dev setup.

```
$ docker-compose up -d
$ docker-compose exec backend sh
/app/backend # npm install
...
/app/backend # npm t
```
     
 
