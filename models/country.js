module.exports = (sequelize, DataTypes) => {
    const country = sequelize.define(
      "country",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        iso: {
          type: DataTypes.STRING,
          allowNull: false,
          // primaryKey:true,
          // unique: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          // primaryKey:true,
          // unique: true,
        },
        nicename: {
          type: DataTypes.STRING,
          allowNull: false,
          // primaryKey:true,
          // unique: true,
        },
        iso3: {
          type: DataTypes.STRING,
          allowNull: true,
          // primaryKey:true,
          // unique: true,
        },
        image: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        numcode: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        phonecode: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
          allowNull: true,
          defaultValue: null,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
      },
      {
        tableName: "country",
        timestamps: true,
        createdAt: "created_at", // alias createdAt as created_at
        updatedAt: "updated_at",
        underscored: true,
      }
    );
  
    country.associate = (models) => {
    //   country.hasOne(models.currencies, {foreignKey: "country_id"});
      country.belongsTo(models.currencies, { foreignKey: "currency_id" });
      
    };
    return country;
  };
  