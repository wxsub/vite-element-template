import Client from 'ssh2-sftp-client'
import fs from 'fs'
import path from 'path'
import ora from 'ora'
import { setTimeout } from 'timers/promises'

const env = process.argv[process.argv.length - 1]

const sftpServeConfig = env === 'development' ? {
    host: '124.221.192.243',
    port: 22,
    localDir: "./dist",
    serverDir: "/opt/mcyx/front/admin",
    user: 'front',
    password: 'mcyx123789654'
} : {}

const spinner = ora('Initializing upload').start()
const maxRetries = 3 // Maximum number of retries
const retryDelay = 2000 // Retry interval (ms)

async function CreatingConnection(currentAttempt = 1) {
    if (!fs.existsSync(sftpServeConfig.localDir) || fs.readdirSync(sftpServeConfig.localDir).length === 0) {
        console.log('⚠️ Execute build to get the folder that needs to be uploaded.\n')
        return
    }

    const sftp = new Client()

    try {
        spinner.start(`Trying to connect to server (${currentAttempt} times)`)
        
        await sftp.connect({
            host: sftpServeConfig.host,
            port: sftpServeConfig.port,
            username: sftpServeConfig.user,
            password: sftpServeConfig.password
        })

        spinner.succeed('Connection successful \n')
        await prepare(sftp)
        await upload(sftp)
    } catch (err) {
        const errorMsg = (err.cause || err).message || "❌ Connection failed"
        spinner.fail(`Error：${errorMsg}`)
        if (currentAttempt < maxRetries) {
            await setTimeout(retryDelay)
            await CreatingConnection(currentAttempt + 1)
        } else {
            console.error('❌ The maximum number of retries has been reached')
        }
    } finally {
        if (sftp.client) await sftp.end()
    }
}

async function upload(sftp) {
    try {
        const totalBytes = calculateDirSize(sftpServeConfig.localDir)
        
        spinner.start(`Uploading File to server`)

        await sftp.uploadDir(sftpServeConfig.localDir, sftpServeConfig.serverDir, {
            chunkSize: 1024 * 32
        })
        
        spinner.succeed(`Upload completed (${formatBytes(totalBytes)})`)
    } catch (err) {
        spinner.stop()
        throw new Error(`❗ Upload failed: ${err.message}`)
    }
}

async function prepare(sftp) {
    try {
        const remotePath = sftpServeConfig.serverDir
        if (await sftp.exists(remotePath)) {
            spinner.text = 'Cleaning existing directory...'
            await sftp.rmdir(remotePath, true)
        }
        
        await Promise.race([
            sftp.mkdir(remotePath, true),
            new Promise((_, reject) => 
                setTimeout(5000).then(() => 
                    reject(new Error('Directory creation timeout'))
                )
            )
        ])
        
        const stats = await sftp.stat(remotePath)
        const hasWrite = (stats.mode & 0o200) || stats.rights.write
        if (!hasWrite) {
            throw new Error('Remote directory is not writable')
        }
    } catch (err) {
        if (err.message.includes('Permission denied')) {
            throw new Error('❗ Remote directory permission denied (check SSH config)')
        }
        throw err
    }
}

function calculateDirSize(dir) {
    const stats = fs.statSync(dir)
    if (stats.isDirectory()) {
        return fs.readdirSync(dir)
            .reduce((sum, file) => sum + calculateDirSize(path.join(dir, file)), 0)
    }
    return stats.size
}

function formatBytes(bytes) {
    const units = ['B', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}

CreatingConnection()