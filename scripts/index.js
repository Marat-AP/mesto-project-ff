// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

function createCard(cardData, cardDelete) {
    const cardTemplate = document.getElementById('card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    const cardName = cardElement.querySelector('.card__title');
    cardName.textContent = cardData.name;
    cardImage.src = cardData.link;
    const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', () => {
        cardDelete(cardElement);
    });

    return cardElement;
}

function cardRemoval (cardElement) {
    cardElement.remove();
}

const cardList = document.querySelector('.places__list');

initialCards.forEach((item) => {
    const cardElement = createCard(item, cardRemoval);
    cardList.append(cardElement);
})