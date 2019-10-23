module.exports = {
  id: 1,
  name: '生产环境',
  domain: process.argv.splice(2)[0] === 'old' ? '	*****' : '******', // 域名
  host: '********', // ip
  port: 22, // 端口
  username: 'root', // 登录服务器的账号
  password: '*****', // 登录服务器的账号
  path:
    process.argv.splice(2)[0] === 'old' ? '/data/dashboard-otc-web/build' : '/data/new_service/dashboard-otc-web/build' // 发布至静态服务器的项目路径
}
