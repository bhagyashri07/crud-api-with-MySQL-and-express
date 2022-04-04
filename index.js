require("dotenv").config();
const express = require("express");
const app = express();
const { Sequelize,DataTypes, json } = require("sequelize");

const port = process.env.PORT || 9090;
console.log(process.env.PORT);

app.use(express.json());
//app.set("view engine", "ejs");



 const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.MYSQLUSERNAME,
    process.env.MYSQLPASSWORD,
    {
      host: "localhost",
      dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
    }
  );
async function connection() {


  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    return null;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return error;
  }
}

const Assignment = sequelize.define('assignment', {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    subject: {
      type: DataTypes.STRING
       //allowNull defaults to true
    }
  }, {
    // Other model options go here
  });


  // 1) post operation---->

  app.post("/api/create",async(req,res)=>{

      
      try{
        const subject = await Assignment.create({
           name: req.body.name,
           subject:req.body.subject,
           
           });

        res.json({message:"Success",data:subject})
      }
      catch(err){

        res.json({message:"Error",data:err})

      }


  })

// 2) get all operation---->  

  app.get("/api/getAll",async(req,res)=>{
    try{
      const subject = await Assignment.findAll();
      

      res.json({message:"Success",data:subject})
    }
    catch(err){

      res.json({message:"Error",data:err})

    }


 })

// 3) get by id operation---->

 app.get("/api/getById/:id", async (req, res) => {
  try {
    const subject = await Assignment.findAll({
      where: {
        id: req.params.id,
      },
    });

    res.json({ message: "Success", data: subject });
  } catch (err) {
    res.json({ message: "Error", data: err });
  }
});


// 4) update operation---->

app.put("/api/update/:id", async (req, res) => {
  const data = await Assignment.update(
    { name: req.body.name,
      subject:req.body.subject },
    {
      where: {
        id: req.params.id,
      },
    }
  );

  res.json({ message: "Succes", data: data });
});


  
// 5) delete operation---->

app.delete("/api/delete/:id",async(req,res)=>{
  await Assignment.destroy({
    where: {
      id: req.params.id,
     
    }

  });
  res.json({message:"Success"})

})


// Env file --->
connection().then(err=>{
    if(!err){
        app.listen(port, () => {
            console.log("Server Running");
          });

    }
    else{
        console.log(err);
    }

})
