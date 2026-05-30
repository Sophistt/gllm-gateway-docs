import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'gllm-gateway',
  description: 'LLM API 网关文档',
  base: '/gllm-gateway-docs/',
  lang: 'zh-CN',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: 'API 参考', link: '/api/chat-completions' },
      { text: '管理员', link: '/admin/guide' },
      { text: '架构', link: '/architecture/overview' },
    ],
    sidebar: [
      {
        text: '指南',
        items: [{ text: '快速开始', link: '/guide/getting-started' }],
      },
      {
        text: 'API 参考',
        items: [
          { text: '聊天补全', link: '/api/chat-completions' },
          { text: '模型列表', link: '/api/models' },
        ],
      },
      {
        text: '管理员指南',
        items: [{ text: '用户与密钥管理', link: '/admin/guide' }],
      },
      {
        text: '架构',
        items: [{ text: '架构总览', link: '/architecture/overview' }],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Sophistt/gllm-gateway-docs' },
    ],
  },
}))
