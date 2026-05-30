# Шаблон конфигов деплоя (nginx) — коммитится в git.

```bash
cp -R deploy.example deploy   # рабочая копия, deploy/ в .gitignore
```

Структура:

```
deploy.example/nginx/
  *.conf
  snippets/
    rassvet-proxy.conf
    websocket-map.conf
```
