# 模型列表

**端点**：`GET /v1/models`

**认证**：`Authorization: Bearer <api-key>`

透传 OpenAI 的模型列表接口。

## 请求

```bash
curl http://localhost:8080/v1/models \
  -H "Authorization: Bearer gw-xxxxxxxx..."
```

## 响应

响应体直接透传 OpenAI `/v1/models` 的原始响应：

```json
{
  "object": "list",
  "data": [
    {
      "id": "gpt-4o",
      "object": "model",
      "created": 1715367049,
      "owned_by": "system"
    }
  ]
}
```

> **注意**：此接口仅返回 OpenAI 提供商的模型列表。Anthropic 模型（如 `claude-*`）可直接在 `/v1/chat/completions` 中使用，无需出现在此列表中。
