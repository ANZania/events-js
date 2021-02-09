const CACHE = 'cache-v1';

function fromCache(request) {
    return caches.open(CACHE).then((cache) =>
        cache.match(request)
            .then((matching) => matching || Promise.reject('no-match'))
    );
}

const calculateDelay = (dayAmount, date) => {
    const msAmount = dayAmount * 86400000;
    const currentDate = new Date();
    const eventDate = new Date(date);

    const delay = (eventDate - currentDate - msAmount)
    if (delay > 0) {
        return delay
    } else return undefined

}

const sendNotification = (date, name, delay, event = '') => {
    event.source.postMessage({
        body: `The event "${name}" will start in ${delay} days. The start date for this event is ${date} `,
        icon: './src/img/js.png'
    })
}

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE).then((cache) => {
            return cache.addAll([
                './'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(fromCache(event.request))
});

self.addEventListener('message', (event) => {
    const {date, name} = event.data;
    const delayForWeek = calculateDelay(7, date);
    const delayForThreeDays = calculateDelay(3, date);
    const delayForOneDay = calculateDelay(1, date);

    console.log('message received');
    console.log('date = ', date);
    console.log('name = ', name);
    console.log('delays = ', delayForWeek, delayForThreeDays, delayForOneDay)


    const timeOut = setTimeout(() => {
        sendNotification(date, name, 56, event)
    }, 7000);

    if (delayForWeek) {
        const timeOutForWeek = setTimeout(() => {
            sendNotification(date, name, 7, event)
        }, delayForWeek)
    }

    if (delayForThreeDays) {
        const timeOutForThreeDays = setTimeout(() => {
            sendNotification(date, name, 3, event)
        }, delayForThreeDays);
    }

    if (delayForOneDay) {
        const timeOutForOneDay = setTimeout(() => {
            sendNotification(date, name, 1, event)
        }, delayForOneDay);
    }
})