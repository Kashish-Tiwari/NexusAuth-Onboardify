module.exports = (sequelize, DataTypes) => {
    const address = sequelize.define(
        'addresses',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            // country: {

            // type: DataTypes.ENUM('india','cameroon', 'united kingdom'),
            //      allowNull: true
            // },
            country: {

                type: DataTypes.STRING,
                allowNull: true
            },
            house_number: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            street: {
                type: DataTypes.STRING,
                allowNull: true
            },
            apartment: {
                type: DataTypes.STRING,
                allowNull: true
            },
            state: {
                type: DataTypes.STRING,
                allowNull: true
            },
            city: {
                type: DataTypes.STRING,
                allowNull: true
            },
            postal_code: {
                type: DataTypes.STRING,
                allowNull: true
            },
            address_type: {

                type: DataTypes.ENUM('Home', 'Office','Other'),
                allowNull: true
            },
            is_primary: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            is_delivery_primary: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            tableName: 'addresses',
            timestamps: true,
            createdAt: "created_at", // alias createdAt as created_at
            updatedAt: "updated_at",
            underscored: true
        },
    )
    address.associate = (models) => {
        address.belongsTo(models.clients, { foreignKey: 'client_id' })

    }
    return address;
}; 