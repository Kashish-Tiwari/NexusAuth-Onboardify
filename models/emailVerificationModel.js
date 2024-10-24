module.exports = (sequelize, DataTypes) => {
    const email_verification = sequelize.define(
      "email_verification",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },

        unique_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        link_url: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        old_email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        type: {
          type: DataTypes.ENUM("Verification", "ChangePassword"),
          allowNull: true,
        },
        verified_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        tableName: "email_verification",
        timestamps: true,
        createdAt: "created_at", // alias createdAt as created_at
        updatedAt: "updated_at",
        underscored: true,
      }
    );
    email_verification.associate = (models) => {
        email_verification.belongsTo(models.clients, {foreignKey: 'client_id'})

    }
    return email_verification;
}; 