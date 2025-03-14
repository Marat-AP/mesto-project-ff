import './pages/index.css';
import { initialCards } from './cards.js';
import { createCard, cardRemoval, cardLike } from './components/card.js';
import { openModal, closeModal, handleOverlayClick } from './components/modal.js';

function cardImageClick(cardData) {
    const popupImage = document.querySelector('.popup_type_image');
    const popupImageElement = popupImage.querySelector('.popup__image');
    const popupCaption = popupImage.querySelector('.popup__caption');
    popupImageElement.src = cardData.link;
    popupImageElement.alt = cardData.name;
    popupCaption.textContent = cardData.name;
    openModal(popupImage);
}

const cardList = document.querySelector('.places__list');

initialCards.forEach((item) => {
    const cardElement = createCard(item, cardRemoval, cardLike, cardImageClick);
    cardList.append(cardElement);
});

const profileEditButton = document.querySelector('.profile__edit-button');
const popupEditProfile = document.querySelector('.popup_type_edit');
const nameInput = document.querySelector('.popup__input_type_name');
const jobInput = document.querySelector('.popup__input_type_description');
const profileName = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');

profileEditButton.addEventListener('click', function() {
    nameInput.value = profileName.textContent;
    jobInput.value = profileJob.textContent;
    openModal(popupEditProfile);
});

const popupCloseButtons = document.querySelectorAll('.popup__close');
popupCloseButtons.forEach((button) => {
    button.addEventListener('click', function() {
        const popup = button.closest('.popup');
        closeModal(popup);
    });
});

const popups = document.querySelectorAll('.popup');
popups.forEach((popup) => {
    popup.addEventListener('click', handleOverlayClick);
});

const formEditProfile = document.querySelector('.popup__form[name="edit-profile"]');

function handleProfileFormSubmit(evt) {  
    evt.preventDefault();
    profileName.textContent = nameInput.value;
    profileJob.textContent = jobInput.value;
    closeModal(popupEditProfile);
}

formEditProfile.addEventListener('submit', handleProfileFormSubmit);

const addButton = document.querySelector('.profile__add-button');
const popupAddCard = document.querySelector('.popup_type_new-card');
addButton.addEventListener('click', function() {
    openModal(popupAddCard);
});

const formAddCard = document.querySelector('.popup__form[name="new-place"]');
const cardNameInput = formAddCard.querySelector('.popup__input_type_card-name');
const cardPhotoLinkInput = formAddCard.querySelector('.popup__input_type_url');

function handleAddCardFormSubmit(evt) {
    evt.preventDefault();
    const cardData = {
        name: cardNameInput.value,
        link: cardPhotoLinkInput.value
    };
    const cardElement = createCard(cardData, cardRemoval, cardLike, cardImageClick);
    cardList.prepend(cardElement);
    closeModal(popupAddCard);
    formAddCard.reset();
}

formAddCard.addEventListener('submit', handleAddCardFormSubmit);