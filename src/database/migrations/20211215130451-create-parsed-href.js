module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('used_hrefs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('used_hrefs')
  }
}