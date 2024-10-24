const env = require("./dbConfig.js");

const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    dialect: env.dialect,
    logging: false,
    //   operatorsAliases: false,
    pool: {
        min: 0,
        max: 5,
        idle: 10000,
    }
});
sequelize.authenticate().then(() => {
    console.log('Connected');
}).catch((err) => {
    console.log('Error connecting DB', err);
})

const db = {};
db.getPagination = (page, size) => {
    const limit = size ? + size : 10;
    let offset = page ? limit * (page - 1) : 0;
    console.log(offset, 'offset');
    return { limit, offset };
};

db.getPagingData = (data, page, limit) => {
    const {count: count, rows: rows} = data;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(count / limit);
    return { count, rows, totalPages, currentPage , limit };
};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.clients = require("../models/client.js")(sequelize, DataTypes);
db.address = require("../models/addressModel.js")(sequelize, DataTypes);
db.country = require("../models/country.js")(sequelize, DataTypes);
db.currencies = require("../models/currencies.js")(sequelize, DataTypes);
db.activity_logs = require("../models/activityLogs.js")(sequelize, DataTypes);
db.email_verification = require("../models/emailVerificationModel.js")(sequelize, DataTypes);




Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

(async () => {
    await db.sequelize.sync().catch(err => {
        console.error(err.message);
        return err;
    });
})();
module.exports = db;

