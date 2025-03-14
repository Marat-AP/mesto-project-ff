export function createCard(cardData, cardDelete, cardLike, cardImageClick) {
    const cardTemplate = document.getElementById('card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    const cardName = cardElement.querySelector('.card__title');
    cardName.textContent = cardData.name;
    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', () => {
        cardDelete(cardElement);
    });

    const likeButton = cardElement.querySelector('.card__like-button');
    likeButton.addEventListener('click', () => {
        cardLike(likeButton);
    });

    cardImage.addEventListener('click', () => {
        cardImageClick(cardData);
    });

    return cardElement;
}

export function cardRemoval(cardElement) {
    cardElement.remove();
}

export function cardLike(likeButton) {
    likeButton.classList.toggle('card__like-button_is-active');
}