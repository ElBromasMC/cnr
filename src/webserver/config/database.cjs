module.exports = {
  development: {
    url: process.env.POSTGRESQL_URL,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeSeeds'
  },
  test: {
    url: process.env.POSTGRESQL_URL,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeSeeds'
  },
  production: {
    url: process.env.POSTGRESQL_URL,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeSeeds',
    logging: false
  }
};
