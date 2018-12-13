module.exports = function (sequelize, Sequelize) {
  return sequelize.define('room', {
    id: {
      type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: ''
    },
    desc: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: ''
    },
    info: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: ''
    },
    serverId: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: ''
    },
    tableCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    visual: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
      freezeTableName: true // Model 对应的表名将与model名相同
    });
}