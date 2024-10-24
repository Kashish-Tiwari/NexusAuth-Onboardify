const express = require('express');
const { Op} = require('sequelize');
const clients = require('../../config/db').clients;
const address= require('../../config/db').address;

exports.homePage = async (req, res) => {
  try {
    req.module_type='Homepage'
    req.message=`Homepage for ${req.client.first_name+" "+req.client.last_name}.`
    const profile = await clients.findOne({
      where: {
        id: req.client.id,
        deleted_at: { [Op.is]: null }
      },
      attributes: ['first_name', 'middle_name', 'last_name', 'phone','tax_residency', 'phone_code', 'date_of_birth','head','sub_head_type','email_cross','doc_cross', 'address', 'email', 'avatar','referral_code','doc_verify_reason','doc_image_verify_reason', 'doc_verified_at', 'email_verified_at', 'verification_doc_image', 'verification_doc_id', 'doc_verified_status','doc_image_verified_status','last_password','is_remit','is_marketplace','is_splitbill','is_autolocksecurity','phone_activation','email_activation','reward_bonus'],
      include: {
        model: address, 
        as: 'addresses', 
    },
    })
    console.log(req.headers, "REEQQHEADER!!!!");
    if (profile) {
      profile.address=''
      profile.verification_doc_image ? process.env.UPLOADS + profile.verification_doc_image : 'null'
      profile.verification_doc_id ? process.env.UPLOADS + profile.verification_doc_id : 'null'
      profile.dataValues.is_email_verified = profile.dataValues.email_verified_at ? true : false;
      profile.dataValues.is_doc_verified = profile.dataValues.doc_verified_at ? true : false;
      profile.avatar ? process.env.UPLOADS + profile.avatar : process.env.UPLOADS + 'default.png';

      profile.avatar = process.env.UPLOADS + profile.avatar;
      profile.verification_doc_image = process.env.UPLOADS + profile.verification_doc_image;
      profile.verification_doc_id = process.env.UPLOADS + profile.verification_doc_id;
      return res.status(200).json({status: true, message: `Welcome ${profile.first_name}`,
       data: {profile, 
        default_homepage: {
          head: profile.head==undefined||profile.head==null?"":profile.head,
          desc: profile.sub_head_type==undefined||profile.sub_head_type==null?"":profile.sub_head_type
        }
      }});
    } else {
      return res.status(400).json({status: false, message: "Profile not found"});
    }

  } catch (error) {
    console.error('Error fetching profiles:', error);
    return res.status(400).json({error: 'Internal server error', error: error.message});
  }


}