const pg_connection=require('./src/base/pg_connection')
const mongo_connection=require('./src/base/mongo_connection')
const Joi=require('joi')

const process_data=async(callback)=>{
    console.log("process data")
    const admission_data=await pg_connection('SELECT * FROM admission')
    const students_data=await pg_connection('SELECT * FROM students')
    const batches_data=await pg_connection('SELECT * FROM batches')
    // console.log(result)
    const db=await mongo_connection()
    // console.log(db)
    // db.collection('students').insertMany(result)
    // console.log(db.collection('students').find(element.student_id))
    for (const element of students_data) {

        const existingStudent = await db.collection('students').findOne({ student_id: element.student_id });
        // console.log(existingStudent)
        if(existingStudent){
            console.log("Student is Present",element.student_id)
            callback();

        }
        else{
            const schema=Joi.object({
                student_id:Joi.number().required(),
                student_name:Joi.string().required(),
                student_email:Joi.string().email().required(),
                student_contact:Joi.number().required(),
                student_class:Joi.string().required(),
                student_attendance:Joi.number().required(),
                student_grade:Joi.string().required(),
            })
           // console.log(schema.validate(element))
            if(schema.validate(element).error){
                console.log("Schema Validation Failed")
                callback()
            }else{
                 await db.collection('students').insertOne(element)
                console.log("Students data inserted")
                callback()
            }          
            
        }
    }
    console.log("admission data")
    for(const element of admission_data){
        console.log("admission data 1")
        const existingAdmission=await db.collection('admission').findOne({admission_id:element.admission_id})
        if(existingAdmission){
            console.log("Admission is Present",element.admission_id)
            callback();
        }else{
             const schema=Joi.object({
                admission_id:Joi.number().required(),                
                admission_class:Joi.string().required(),
                admission_sources:Joi.string().required(),
                admission_date:Joi.date().required(),
                admission_fees:Joi.number().required(),
                year:Joi.number().required(),
                month:Joi.number().required(),
                student_id:Joi.number().required(),
            })
            console.log(1)
            if(schema.validate(element).error){
                console.log("Schema Validation Failed",element)
                callback()
            }else{
                 await db.collection('admission').insertOne(element)
                console.log("Admission data inserted")
                callback()
            }

        }
    }

    for(const element of batches_data){
        console.log("batches_data 1")
        const existingBatch=await db.collection('batches').findOne({batch_id:element.batch_id})
        if(existingBatch){
            console.log("Batches is Present",element.batch_id)
            callback();
        }else{
             const schema=Joi.object({
                year:Joi.number().required(), 
                batch_id:Joi.number().required(),                
                batch_code:Joi.string().required(),
                start_date:Joi.date().required(),
                end_date:Joi.date().required(),
                student_count:Joi.number().required(),
                trainer_name:Joi.string().required(),
                student_fee:Joi.number().required(),
                course_name:Joi.string().required(),
            })
            console.log(1)
            if(schema.validate(element).error){
                console.log("Schema Validation Failed",schema.validate(element).error)
                callback()
            }else{
                 await db.collection('batches').insertOne(element)
                console.log("Batch data inserted")
                callback()
            }

        }
    }
}
module.exports=process_data

