'use strict'

const eventsListWrapper = document.querySelector('.events-list__wrapper');
const subscriptionButton = document.querySelector('.container__header__subscription-button');
const requestURL = './data.json';
let eventsData;

const isFinished = date => {
    const currentDate = new Date();
    const eventDate = new Date(date);

    if (eventDate < currentDate) {
        return 'Finished'
    } else {
        return 'Upcoming'
    }
}

const reduceTextShield = text => {
    const regExp = /[&<>"\/]/g;

    const specialCharMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '/': '&#x2F;'
    };

    text = text.replace(regExp, (char) => {
        return specialCharMap[char]
    });

    return text
}

const renderNotificationButton = (date, name) => {
    const status = isFinished(date);
    let button;

    if (status === 'Finished') {
        button = '<button class="container__header__notify-button" disabled>Finished</button>'
    } else if (localStorage.getItem(name)) {
        button = '<button class="container__header__notify-button notify-button-disabled">Tracking...</button>'
    } else {
        button = '<button class="container__header__notify-button">Notify me!</button>'
    }

    return button
}

const initializeRequest = async() => {
    await fetch(requestURL)
    .then(response => {
        return response.json()
    })
    .then(data => {
        renderEvents(data)
    })
}

const checkIfAllTracked = (data) => {
    const length = data.length;
    let counter = 0;

    data.forEach(element => {
        if (localStorage.getItem(element.name) || (isFinished(element.endDate) === 'Finished')) {
            counter++;
        }
    })

    console.log(counter);
    if (length === counter) {
        localStorage.setItem('isTrackingAll', 'true');
    }
}

const renderSubscriptionButton = (data) => {
    checkIfAllTracked(data);
    if (localStorage.getItem('isTrackingAll')) {
        subscriptionButton.classList.add('notify-button-disabled');
        subscriptionButton.textContent = 'You are tracking all events'
    } else {
        subscriptionButton.classList.remove('notify-button-disabled');
        subscriptionButton.textContent = 'Notify me of all upcoming events'
    }
}

const renderEvents = (data) => {
    eventsData = data;
    renderSubscriptionButton(data);

    data.forEach(element => {
        eventsListWrapper.insertAdjacentHTML('beforeend', `
        <li class="events-list__element">
            <section class="events-list__element__wrapper">
                <p class="events-list__element__text">${element.startDate}</p>
                <a href="${element.url}" target="blank">
                    <p class="events-list__element__text">${reduceTextShield(element.name)}</p>
                </a>
                <p class="events-list__element__text">${isFinished(element.endDate)}</p>
            </section>
            ${renderNotificationButton(element.endDate, element.name)}
        </li>
        `)
    })
}

const initializeEventListeners = () => {
    window.addEventListener('click', (event) => {
        const target = event.target;

        if (target.closest('.container__header__notify-button')) {
            const element = target.closest('.events-list__element');
            const elementStartDate = element.querySelectorAll('.events-list__element__text')[0].textContent;
            const elementName = element.querySelectorAll('.events-list__element__text')[1].textContent;

            if (localStorage.getItem(elementName)) {
                localStorage.removeItem(elementName);
                localStorage.removeItem('isTrackingAll');
                eventsListWrapper.textContent = '';
                renderEvents(eventsData);

                createNotification(`You have stopped tracking ${elementName}.`, elementName);
            } else {
                localStorage.setItem(elementName, elementStartDate);
                eventsListWrapper.textContent = '';
                renderEvents(eventsData);

                createNotification(`You have subscribed to ${elementName} notifications. 
                It will start on ${elementStartDate}.`, elementName);
            }
        }

        if (target.closest('.container__header__subscription-button')) {
            if (localStorage.getItem('isTrackingAll')) {
                localStorage.clear();
                eventsListWrapper.textContent = '';
                renderEvents(eventsData);

                createNotification(`You have unsubscribed from all events.`);

            } else {
                localStorage.setItem('isTrackingAll', 'true');
                eventsListWrapper.textContent = '';
                eventsData.forEach(element => {
                    if (!localStorage.getItem(element.name)) {
                        localStorage.setItem(element.name, element.startDate);
                    }
                })
                renderEvents(eventsData)

                createNotification(`You have subscribed to all events.`);
            }


        }


    })
}

initializeRequest()
initializeEventListeners()