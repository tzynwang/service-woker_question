// openCaches()
// logCacheKeys()
// ifCacheExist('test cache')
// matchAndPut('https://picsum.photos/id/237/200/300')
// fetchImageAndAppend()

async function openCaches () {
  const cache = await caches.open('test cache')
  cache.add('./images/undraw_Appreciation_re_p6rl.svg')
  cache.add('./images/undraw_work_in_progress_uhmv.svg')
}

async function logCacheKeys () {
  const cache = await caches.open('test cache')
  const keys = await cache.keys()
  console.log(keys)
}

async function ifCacheExist (cacheName) {
  const existFlag = await caches.has(cacheName)
  console.log(`${cacheName} exists: ${existFlag}`)
}

async function matchAndPut (url) {
  // const imageUrl = './images/undraw_work_in_progress_uhmv.svg'
  const cacheResponse = await caches.match(url)
  if (cacheResponse &&
    cacheResponse.status < 400 &&
    cacheResponse.headers.has('content-type') &&
    cacheResponse.headers.get('content-type').match(/jpeg/i)) {
    return cacheResponse.clone()
  } else {
    // console.log('not in cache')
    const fetchResponse = await fetch(url)
    if (!fetchResponse.ok) throw fetchResponse.statusText

    const cache = await caches.open('test cache')
    cache.put(url, fetchResponse.clone())
    return fetchResponse
  }
}

async function fetchImageAndAppend () {
  const responseBlob = await (await matchAndPut('https://picsum.photos/id/237/200/180')).blob()
  console.log(responseBlob) // {size: 8748, type: "image/jpeg"}

  const url = URL.createObjectURL(responseBlob)
  const img = document.createElement('img')
  img.src = url
  document.querySelector('main.container').append(img)
}
