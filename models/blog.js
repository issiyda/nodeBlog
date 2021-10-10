const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('./config')
const User = require('./user')

const Blog = sequelize.define('blogs', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: Sequelize.INTEGER
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contents: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  deletedAt: {
    type: Sequelize.DATE
  }
})

Blog.belongsTo(User)

module.exports = Blog
