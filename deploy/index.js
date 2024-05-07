const name = "租户端系统"
const { exec } = require('child_process')
const ftp = require('basic-ftp')
const axios = require('axios')
const moment = require('moment')
const fs = require('fs')
const path = require('path')
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2)), env = argv.env || 'dev', envName = env === 'production' ? '生产' : '测试';

const CONFIG = {
  host: '120.27.146.52',
  port: 21,
  localDir: "./hcbip_tenant_v2",
  serverDir: "/",
  user: 'dev_hcbip_tenant_qishunbao_com',
  password: 'aErTjD27scPNMWTK'
}
const ora = require('ora')
const chalk = require('chalk')
const spinner = ora('正在上传...')
const clearDest = false

fs.readFile(path.resolve('build/token.key'), 'utf8', (err, dataRaw) => {
  if (err) {
    console.log(chalk.red('  未检测到身份令牌。请检查令牌文件\n'))
    throw err
  }
  const raw = dataRaw.trim()
  if (raw) {
    console.log("正在校验令牌...")
    axios.get(`http://dev_hcbip.qishunbao.com/index.php/mobile/h5/ftpinfo?code=${raw}&env=${env === 'production' ? 2 : 1}&type=1`).then(({ data }) => {
      if (data.data) {
        const { host, ftp_port, ftp_username, ftp_pwd, name, url } = data.data
        CONFIG.url = url
        CONFIG.name = name
        CONFIG.host = host
        CONFIG.port = ftp_port
        CONFIG.user = ftp_username
        CONFIG.password = ftp_pwd
        console.log(`[${name}] ${env} Token verification successful`)
        ensureUpload()
      } else {
        console.log("Token information not obtained")
      }
    }).catch(error => {
      console.error(`令牌校验失败：${error}`);
    })
  }
})

async function upload(client) {
  await client.ensureDir(CONFIG.serverDir)
  if (clearDest) {
    await client.clearWorkingDir()
  }
  await client.trackProgress(info => {
    if (info && info.bytes) {
      spinner.start()
    }
  })
  await client.uploadFromDir(CONFIG.localDir)
}

async function ensureUpload(current = 1, max = 6) {
  if (!fs.existsSync(CONFIG.localDir)) {
    console.log(chalk.red('  执行build, 以得到需要上传的文件夹.\n'))
    return
  }
  const client = new ftp.Client(60000)
  client.ftp.verbose = false
  try {
    console.log(`正在连接 ${CONFIG.host}`)
    await client.access({
      host: CONFIG.host,
      user: CONFIG.user,
      password: CONFIG.password
    })
    console.log(`连接成功 \n`)
    await upload(client)
    spinner.stop()
    console.log(chalk.bgGreen('==== 上传完成 ===='))
    extractionGitLog()
  } catch (err) {
    if (err.message.includes('Login authentication failed')) {
      axios.post('https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=a6b31f23-ac89-462a-8794-7c108555758c', {
        "msgtype": "text",
        "text": {
          "content": `前端 【${name}${envName}环境】 发布失败！请检查FTP密码是否更换，确认更新后通知前端重新进行版本发布`,
          "mentioned_mobile_list":["15156633961"]
        }
      }).then(() => {
        console.log(chalk.red(`[上传失败]: 服务器密码不正确，已广播更新通知\n`))
      }).catch(error => {
        console.error(error)
      })
    } else {
      spinner.stop()
      await ensureUpload(current + 1, max)
    }
  } finally {
    client.close()
  }
}

function extractionGitLog() {
  const since = '4 hours ago';
  moment.locale('zh_cn')

  let content = `<font color="warning">${name}${envName}环境</font> 已发布。请注意核对TAPD中前端问题的解决时间和下方近期修复BUG。 \n
  >测试地址: <font color=\'comment\'>${CONFIG.url || '无'}</font> \n
  >发布时间：<font color=\'comment\'>${moment().format('LLL')}</font>`;

  if (CONFIG.name) {
    content+= `\n
    >发布人：<font color=\'comment\'>${CONFIG.name}</font>`
  }

  exec(`git log --since="${since}" --format="%h %s"`, (error, stdout, stderr) => {
    if (error) { console.error(`get git commit error：${error}`) }
    if (stderr) { console.error(`get git commit info: ${stderr}`) }
    if (stdout) {
      const regex = /\bfix[]?\s+([^\[\]]+)\s*\]\s*:\s*(.+)/
      const result = stdout.split('\n').filter(log => {
        return !/^\s*$|^\s*#/.test(log)
      }).map(log => {
        const [hash, ...parts] = log.split(' ');
        const title = parts.join(' ');
        const match = regex.exec(title);
        if (match) {
          const [_, desc, url] = match;
          return `[ [${desc.trim()}](${url.trim()}) ]`;
        }
        return null;
      }).filter(log => log !== null)
      if (result) {
        content = content + `\n\n近期修复：<font color=\'comment\'>${result.join('\n') || '暂无记录'}</font>`
      }
    }
    sendMessage(content)
  })
}

function sendMessage(content, mentioned_list = []) {
  if (!content) return
  axios.post('https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=fe4e5756-0663-4d60-9843-35561a532016', {
    msgtype: 'markdown',
    markdown: { content, mentioned_list }
  }, { headers: { 'Content-Type': 'application/json' } }).then(response => {
    const { errcode } = response
    if (errcode === 0) console.log("微信通知已发送")
  }).catch(error => {
    console.error(error)
  })
}