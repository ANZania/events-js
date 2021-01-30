'use strict'

const eventsListWrapper = document.querySelector('.events-list__wrapper');
const requestURL = './data.json';

let eventsData = [];

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
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "/": '&#x2F;'
    };

    text = text.replace(regExp, (char) => {
        return specialCharMap[char]
    })

    return text
}

const renderNotificationButton = date => {
    const status = isFinished(date);

    if (status === 'Finished') {
        return '<button class="container__header__notify-button" disabled >Finished</button>'
    } else {
        return '<button class="container__header__notify-button">Notify me!</button>'
    }
}

const initializeRequest = async() => {
    await fetch(requestURL)
    .then(response => {
        return response.json()
    })
    .then(promise => {
        renderEvents(promise)
    })
}

const renderEvents = (eventsData) => {
    eventsData.forEach(element => {
        eventsListWrapper.insertAdjacentHTML('beforeend', `
        <li class="events-list__element">
            <section class="events-list__element__wrapper">
                <p class="events-list__element__text">${element.startDate}</p>
                <a href="${element.url}" target="blank"><p class="events-list__element__text">${reduceTextShield(element.name)}</p></a>
                <p class="events-list__element__text">${isFinished(element.endDate)}</p>
            </section>
            ${renderNotificationButton(element.endDate)}
        </li>
        `)
    })
}

initializeRequest()