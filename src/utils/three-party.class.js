class ReactiveHandler {
    constructor(base, callback) {
        this.proxy = new Proxy(base, {
            set: (obj, prop, value) => {
                const result = Reflect.set(obj, prop, value)
                callback()
                return result
            },
            get: (obj, prop) => {
                return Reflect.get(obj, prop)
            }
        })
        this.render = callback
    }
}

class Storage extends Ajax {
    static TRANSITORY_BUCKET = Object.create(null)
    static _FETCH_QUEUE__ = Object.create(null)

    static user_info = null

    fetchUserInfo(reload = false) {
        if (Storage.user_info && reload === false) {
            return Promise.resolve(Storage.user_info)
        }
        if (Storage._FETCH_QUEUE__.fetchUserInfo) {
            return Storage._FETCH_QUEUE__.fetchUserInfo
        }
        Storage._FETCH_QUEUE__.fetchUserInfo = new Promise((resolve, reject) => {
            this.get('/user/info').then(res => {
                if (res.code === 0 && res.errorMessage.message === 'success') {
                    // console.log(res)
                    const { data } = res || {}
                    const { is_debug } = data || {}
                    Storage.user_info = new ReactiveHandler(data, this.DynamicNodesRender.bind(this))
                    this.DynamicNodesRender()
                    resolve(data)
                } else {
                    reject(res)
                }
            }).catch(error => {
                reject(error)
            }).finally(() => {
                Storage._FETCH_QUEUE__.fetchUserInfo = null
            })
        })
        return Storage._FETCH_QUEUE__.fetchUserInfo
    }

    bootstrapData(reload = false) {
        const cache = localStorage.getItem("bootstrapData")
        if (cache && reload === false) {
            return Promise.resolve(JSON.parse(cache))
        }

        if (Storage._FETCH_QUEUE__.bootstrapData) {
            return Storage._FETCH_QUEUE__.bootstrapData
        }

        Storage._FETCH_QUEUE__.bootstrapData = new Promise((resolve, reject) => {
            this.get('/api/area/current').then(res => {
                if (res.code === 0) {
                    localStorage.setItem("bootstrapData", JSON.stringify(res.data))
                    resolve(res.data)
                } else {
                    reject(res)
                }
            }).catch(error => {
                reject(error)
            }).finally(() => {
                Storage._FETCH_QUEUE__.bootstrapData = null
            })
        })
        return Storage._FETCH_QUEUE__.bootstrapData
    }

    DynamicNodesRender () {
        try {
            if (!Storage.user_info || !Storage.user_info.proxy) {
                return
            }
            const { base = {} } = Storage.user_info.proxy
            const VARIABLE_EL = document.querySelectorAll("[data-variable-context], [data-variable-attr]")
            VARIABLE_EL.forEach(El => {
                const contextValue = El.getAttribute('data-variable-context')
                const key = El.getAttribute('data-key')
                const attr = El.getAttribute('data-variable-attr')

                if (contextValue && base[contextValue]) {
                    El.innerHTML = base[contextValue]
                }

                if (key && attr && base[key]) {
                    El.setAttribute(attr, base[key])
                }
            })
        } catch (error) {
            console.warn(error)
        }
    }

    message(message, type = 'info') {
        const messageContainer = this.setupMessageContainer()
        const MESSAGE_ID = `message-${Date.now()}`

        const messageBox = document.createElement('div')
        messageBox.classList.add('animate-slide-down')
        messageBox.style.borderWidth = '1px'
        messageBox.id = MESSAGE_ID
        messageBox.classList.add('px-[20px]', 'py-[12px]', 'items-center', 'rounded-[4px]', 'shadow-lg', 'relative', 'flex', 'justify-between')

        const context = document.createElement('div')
        context.innerHTML = message

        const closeAlertButton = document.createElement('button')
        closeAlertButton.textContent = '×'
        closeAlertButton.classList.add('text-lg', 'ml-4')

        switch (type) {
            case 'success':
                messageBox.style.backgroundColor = '#f0f9eb';
                messageBox.style.borderColor = '#e1f3d8';
                context.style.color = '#67C23A';
                closeAlertButton.style.color = '#67C23A';
                break;
            case 'warning':
                messageBox.style.backgroundColor = '#fdf6ec';
                messageBox.style.borderColor = '#faecd8';
                context.style.color = '#E6A23C';
                closeAlertButton.style.color = '#E6A23C';
                break;
            case 'error':
                messageBox.style.backgroundColor = '#fef0f0';
                messageBox.style.borderColor = '#fde2e2';
                context.style.color = '#F56C6C';
                closeAlertButton.style.color = '#F56C6C';
                break;
            default:
                messageBox.style.backgroundColor = '#edf2fc';
                messageBox.style.borderColor = '#EBEEF5';
                context.style.color = '#909399';
                closeAlertButton.style.color = '#888';
                break;
        }

        messageBox.appendChild(context)
        messageBox.appendChild(closeAlertButton)

        messageContainer.appendChild(messageBox)

        closeAlertButton.addEventListener('click', () => {
            messageBox.classList.remove('animate-slide-down')
            messageBox.classList.add('animate-slide-up')
            setTimeout(() => {
                this.clearMessage(MESSAGE_ID)
            }, 300)
        })

        Storage.TRANSITORY_BUCKET[MESSAGE_ID] = {
            timeoutId: setTimeout(() => {
                messageBox.classList.remove('animate-slide-down')
                messageBox.classList.add('animate-slide-up')
                setTimeout(() => {
                    this.clearMessage(MESSAGE_ID)
                }, 300)
            }, 5000),
            message,
            type,
            timestamp: Date.now()
        };
    }

    setupMessageContainer() {
        let messageContainer = document.getElementById('message-box-container')
        if (!messageContainer) {
            messageContainer = document.createElement('div')
            messageContainer.id = 'message-box-container'
            messageContainer.classList.add('fixed', 'top-[60px]', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2', 'space-y-4', 'z-[99999]', 'w-full', 'max-w-xs')
            document.body.appendChild(messageContainer)
        }
        return messageContainer
    }

    clearMessage(messageId) {
        const messageBox = document.getElementById(messageId)
        if (messageBox) {
            messageBox.remove()
        }
        if (Storage.TRANSITORY_BUCKET[messageId] && Storage.TRANSITORY_BUCKET[messageId].timeoutId) {
            clearTimeout(Storage.TRANSITORY_BUCKET[messageId].timeoutId)
            delete Storage.TRANSITORY_BUCKET[messageId]
        }
    }

    redirect() {
        window.location.href = '/auth/v1/login?redirect=' + encodeURIComponent(window.location.href)
    }
}
