export default {
  system: {
    development: 'ws://192.168.110.228:9502/chat/global',
    production: 'ws://1.94.19.153:9502/chat/global'
  }
}

export type Environment = "development" | "production"
