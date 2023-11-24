export const timeArray: string[] = [];
export const longTimeArray: string[] = [];
for (let i = 0; i <= 24; i++) {
  timeArray.push(`${i}:00`, `${i}:30`);
}
longTimeArray.push(`0:10`, `0:20`, `0:30`, `0:40`, `0:50`);
for (let i = 1; i <= 11; i++) {
  longTimeArray.push(`${i}:00`, `${i}:10`, `${i}:20`, `${i}:30`, `${i}:40`, `${i}:50`);
}
longTimeArray.push(`12:00`);

export const fullDays = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

export const addImage = require("./Assets/add-image.png");
export const locationPin = require("./Assets/location-pin.png");
export const more = require("./Assets/more.png");
export const addUser = require("./Assets/add-user.png");
export const block = require("./Assets/block.png");
export const bin = require("./Assets/delete.png");
export const mail = require("./Assets/mail.png");
export const arrow = require("./Assets/arrow.png");
export const money = require("./Assets/money.png");
