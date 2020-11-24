'use strict';
const {Sequelize, Op, Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notEmpty: {
          msg: "Title is required"
        }
      }
    },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true,
        validate: {
          notEmpty: {
            msg: "Author is required"
          }
        }
    },
      genre: Sequelize.STRING,
      year: Sequelize.INTEGER
  }, { sequelize });

  return Book;
};

