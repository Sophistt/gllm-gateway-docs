# 快速开始

## 前置条件

- Docker & Docker Compose
- PostgreSQL 14+
- Redis 6+

## 使用 Docker Compose 启动（推荐）

```bash
git clone https://github.com/Sophistt/gllm-gateway
cd gllm-gateway
cp config.yaml.example config.yaml
```

编辑 `config.yaml`，填入你的配置：

```yaml
server:
  port: 8080

database:
  url: "postgres://postgres:postgres@postgres:5432/gllm_gateway?sslmode=disable"

redis:
  addr: "redis:6379"

encryption_key: "your-32-bytes-secret-key-here!!"  # 必须恰好 32 字节

admin:
  email: "admin@example.com"
  password: "your-admin-password"

providers:
  - name: openai
    base_url: "https://api.openai.com"
    api_key: "sk-..."
  - name: anthropic
    base_url: "https://api.anthropic.com"
    api_key: "sk-ant-..."
```

启动服务：

```bash
docker compose up -d
```

服务默认监听 `http://localhost:8080`。

## 手动编译启动

```bash
go build -o chatbot ./cmd/gateway
./chatbot
```

## 注册用户并获取 API Key

1. 注册账号：

```bash
curl -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "name": "张三"}'
```

2. 管理员登录后审批用户（见[管理员指南](/admin/guide)），审批时会返回 API Key：

```json
{ "api_key": "gw-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }
```

3. 使用 API Key 调用接口：

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Authorization: Bearer gw-xxxxxxxx..." \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-4o", "messages": [{"role": "user", "content": "你好"}]}'
```
