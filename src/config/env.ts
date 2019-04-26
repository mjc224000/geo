const env = (()=>"development")()
export let isPro = env === 'production'
export let isDev = env === 'development'
export let isLocal = env === 'local' || env === 'local_dev'
