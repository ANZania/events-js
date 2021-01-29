'use strict'

const eventsListWrapper = document.querySelector('.events-list__wrapper');
const requestURL = './data.json';

let eventsData = [];

const isFinished = date => {
    const currentDate = new Date();
    const eventDate = new Date(date);

    if (eventDate < currentDate) {
        return 'finished'
    } else {
        return 'upcoming'
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

const initializeRequest = async() => {
    await fetch(requestURL).then(response => {
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
                <a href="${element.url}"><p class="events-list__element__text">${reduceTextShield(element.name)}</p></a>
                <p class="events-list__element__text">${isFinished(element.endDate)}</p>
            </section>
            <button class="container__header__notify-button">Notify me!</button>
        </li>
        `)
    })
}

initializeRequest()