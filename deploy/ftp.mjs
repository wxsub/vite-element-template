import ftp from 'basic-ftp'
import fs from 'fs'
import ora from 'ora'
import { setTimeout } from 'timers/promises'

const env = process.argv[process.argv.length - 1]

const sftpServeConfig = env === 'development' ? {
    host: '<Server Host>',
    port: "<Server Public Port>",
    localDir: "./dist",
    serverDir: "<Server Target Dir>",
    user: "<Server User Name>",
    password: "<Server Password>"
} : {}

const spinner = ora('Initializing upload').start()
const maxRetries = 3 // Maximum number of retries
const retryDelay = 2000 // Retry interval (ms)

async function CreatingConnection(currentAttempt = 1) {
    if (!fs.existsSync(ftpServeConfig.localDir) || fs.readdirSync(ftpServeConfig.localDir).length === 0) {
        console.log('⚠️ Execute build to get the folder that needs to be uploaded.\n')
        return
    }

    const client = new ftp.Client(60000)
    client.ftp.verbose = true

    try {
        spinner.start(`Trying to connect to server (${currentAttempt} times)`)
        await client.access({
            ...ftpServeConfig,
            secure: false,
            passive: true
        })

        spinner.succeed('Connection successful \n')
        await upload(client)
    } catch (err) {
        const errorMsg = err.message
        spinner.fail(`Unknown error：${errorMsg}`)
        if (currentAttempt < maxRetries) {
            await setTimeout(retryDelay)
            await CreatingConnection(currentAttempt + 1)
        } else {
            console.error('❌ The maximum number of retries has been reached')
        }
    } finally {
        client.close()
    }
}

async function upload(client) {
    await client.ensureDir(ftpServeConfig.serverDir)

    // Directory permission check
    const serverStatus = await client.status()
    if (!serverStatus.permissions?.includes('w')) {
        throw new Error('❗ The server directory is not writable')
    }

    await client.trackProgress(info => {
        if (info && info.bytes) {
            spinner.text = `Uploading ${formatBytes(info.bytes)}`
        }
    })

    await client.uploadFromDir(ftpServeConfig.localDir)
    spinner.succeed('Completed')
}

function formatBytes(bytes) {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024
        unitIndex++
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`
}

CreatingConnection()
