import { DataTypes, Model } from "sequelize";
import db from '../config/database.config'
import { ProductInstance } from "./product";

interface UsersAttributes {
  id: string;
  fullname:string;
  email:string;
  gender:string;
  phone:string;
  address:string;
  password:string;
}
export class UserInstance extends Model<UsersAttributes> {}

UserInstance.init({
  id: {
    type:DataTypes.UUIDV4,
    primaryKey:true,
    allowNull:false
  },
  fullname:{
     type:DataTypes.STRING,
     allowNull:false,
     validate:{
         notNull:{
             msg:'full name is required'
         },
         notEmpty:{
             msg:'Please provide full name'
         }
     }
  },
  email:{
    type:DataTypes.STRING,
    allowNull:false,
    unique:true,
    validate:{
        notNull:{
            msg:'email is required'
        },
        isEmail:{
            msg:'Please provide a valid Email'
        }
    }
  },
  gender:{
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
        notNull:{
            msg:'gender is required'
        },
        notEmpty:{
            msg:'Please provide gender status'
        }
    }
  },
  phone:{
    type:DataTypes.STRING,
    allowNull:false,
    unique:true,
    validate:{
        notNull:{
            msg:'phone number is required'
        },
        notEmpty:{
            msg:'Please provide a valid phone number'
        }
    } 
  },
  address:{
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
        notNull:{
            msg:'Address is required'
        },
        notEmpty:{
            msg:'Please provide a address'
        }
    }
  },
  password:{
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
        notNull:{
            msg:'password is required'
        },
        notEmpty:{
            msg:'Please provide a password'
        }
    }
  }
},{
    sequelize:db,
    tableName:'user'
});

UserInstance.hasMany(ProductInstance, {foreignKey:'userId',
as:'product'
}) //the foreign key is what's linking the UserInstance and the TodoInstance

ProductInstance.belongsTo(UserInstance, {foreignKey:'userId',
as:'user'
})

