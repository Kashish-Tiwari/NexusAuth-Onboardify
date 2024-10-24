

module.exports = (sequelize, DataTypes) => {
    const currencies = sequelize.define(
      "currencies",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        short_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        symbol: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        icon: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
          allowNull: true,
          defaultValue: null,
        },
        is_default: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
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
        tableName: "currencies",
        timestamps: true,
        createdAt: "created_at", // alias createdAt as created_at
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
        paranoid: true,
        underscored: true,
      }
    );
     currencies.associate  = (models) =>{
      currencies.belongsTo(models.country, { foreignKey: "country_id" });
      currencies.hasOne(models.currencyWallet,{ foreignKey: 'currency_id' })
     }

    return currencies;
  }; 
