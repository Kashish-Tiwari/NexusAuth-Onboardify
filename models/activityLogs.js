module.exports = (sequelize, DataTypes) => {
    const user_activities = sequelize.define(
      "user_activities",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        api_version: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        module_type: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        message: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        browser: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        ip_address: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        api_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        request: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        response: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: true,
        },
      },
      {
        tableName: "user_activities",
        timestamps: true,
        createdAt: "created_at", // alias createdAt as created_at
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
        paranoid: true,
        underscored: true,
      }
    );
    // banksof316.associate = (models) => {
    //     // clients.hasOne(models.Wallet);
    //     banksof316.belongsTo(models.currencies, { foreignKey: 'currency_id' })
    // }
    return user_activities;
};