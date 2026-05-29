# 聊天补全

**端点**：`POST /v1/chat/completions`

**认证**：`Authorization: Bearer <api-key>`

根据 `model` 字段自动路由：`claude*` 开头的模型转发到 Anthropic，其余转发到 OpenAI。

## 请求

请求体与 OpenAI Chat Completions API 完全兼容。

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Authorization: Bearer gw-xxxxxxxx..." \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "system", "content": "你是一个助手"},
      {"role": "user", "content": "介绍一下你自己"}
    ]
  }'
```

使用 Anthropic 模型：

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Authorization: Bearer gw-xxxxxxxx..." \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-opus-4-5",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

## 响应

响应体直接透传上游提供商的原始响应，格式与 OpenAI 标准一致。

## 配额响应头

| 响应头 | 说明 |
|--------|------|
| `X-Quota-Warning: approaching limit` | Token 用量接近配额上限 |

## 错误码

| HTTP 状态码 | 原因 |
|-------------|------|
| `401 Unauthorized` | API Key 无效或已撤销 |
| `429 Too Many Requests` | 超出 Token 配额 |
| `502 Bad Gateway` | 上游提供商未配置或请求失败 |
