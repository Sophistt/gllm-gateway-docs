---
layout: home
hero:
  name: gllm-gateway
  text: LLM API 网关
  tagline: 统一代理 OpenAI 与 Anthropic，支持配额管理、用量追踪与管理后台
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: API 参考
      link: /api/chat-completions
features:
  - title: 多提供商代理
    details: 根据模型名称自动路由到 OpenAI 或 Anthropic，claude* 模型走 Anthropic，其余走 OpenAI。
  - title: 配额与限流
    details: 基于 Redis 的 Token 配额管理，支持按用户或项目设置每日/每月限额，超限自动拒绝。
  - title: 用量追踪
    details: 所有请求的 Token 消耗与费用记录到 PostgreSQL，支持按用户、项目、时间段查询。
  - title: 管理后台
    details: 内置 Web 管理界面，支持用户审批、API Key 管理、配额设置与用量报表。
---
