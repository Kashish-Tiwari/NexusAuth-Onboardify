
module.exports = (sequelize, DataTypes) => {
    const clients = sequelize.define(
      "clients",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: true,
          unique:true
        },
        first_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        middle_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        last_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        last_password: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        deleted_id: {
          defaultValue: null,
          type: DataTypes.STRING,
          allowNull: true,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        phone_code: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        date_of_birth: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        postal_code: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        address: {
          type: DataTypes.STRING,
          allowNull: true,
        },
  
        email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email_verified_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        country_of_residence: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        otp: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        avatar: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: "default.png",
        },
        verification_doc_id: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        verification_doc_image: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        doc_verified_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        doc_verified_status: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: "Not_applied",
        },
        doc_verify_reason: {
          type: DataTypes.STRING,
          allowNull: true,
        },
  
        doc_image_verified_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
  
        doc_sumbission_time: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        doc_image_verified_status: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: "Not_applied",
        },
  
        doc_image_verify_reason: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        doc_approval_date: {
          type: DataTypes.DATE,
          allowNull: true,
        },
  
        parent_id: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        referral_code: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true,
        },
        otp_time: {
          type: DataTypes.DATE,
          allowNull: true,
        },
  
        citizenship_country: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        tax_residency: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        is_remit: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        is_marketplace: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        is_splitbill: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        is_autolocksecurity: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        placed_on: {
          type: DataTypes.STRING,
          allowNull: true,
          unique:true
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        head: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        sub_head_type: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email_cross: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        doc_cross: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        email_activation: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
        phone_activation: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
        reward_bonus: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
          defaultValue: 0,
        },
        status: {
          type: DataTypes.ENUM("ACTIVE", "INACTIVE", "SUSPENDED", "LOCKED"),
          allowNull: true,
          defaultValue: "INACTIVE",
        },
        last_login: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        save_activity_logs: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
        email_unusual_activity: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
        remember_key: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: null,
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
  
        deleted_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        tableName: "clients",
        timestamps: true,
        createdAt: "created_at", // alias createdAt as created_at
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
        paranoid: true,
        underscored: true,
      }
    );
  
    return clients;
  }     
  