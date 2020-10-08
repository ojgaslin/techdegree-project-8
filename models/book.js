'use strict';
const {Sequelize, Op, Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init({
    title: {
      type: Sequelize.STRING,
      validate: {
        is: ["^[a-z] +$", 'i'] 
      }
    },
      author: {
        type: Sequelize.STRING,
        validate: {
           is: ["^[a-z] +$", 'i']
        }
    },
      genre: Sequelize.STRING,
      year: Sequelize.INTEGER
  }, { sequelize });

  return Book;
};

