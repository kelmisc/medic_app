# medic_app
* app - UI
    * cd ./app and run npm install 
    * cd ./app/ios and run pod install
    * run `npm run ios`
* backend - backend service written in express.js
    * run following sql statement in mysql database
~~~~sql
CREATE  TABLE IF NOT EXISTS `users` (
`id` BIGINT UNSIGNED AUTO_INCREMENT,
`email` VARCHAR(255) NOT NULL,
`password` VARCHAR(255) NOT NULL,
`phone` VARCHAR(50) NOT NULL,
`clinic` VARCHAR(255) NOT NULL,
`address` VARCHAR(100) NOT NULL,
PRIMARY KEY (`id`),
UNIQUE KEY (`email`))
ENGINE = InnoDB;

CREATE  TABLE IF NOT EXISTS consultations
(
    id bigint unsigned auto_increment primary key,
    clinic_id BIGINT UNSIGNED,
    d     varchar(60)  not null,
    patient    varchar(60)  not null,
    diagnosis  varchar(255) null,
    medication varchar(255) null,
    fee        decimal      not null,
    consultDate  date       not null,
    consultTime time        not null,
    followup   tinyint(1)   not null,
    FOREIGN KEY (clinic_id) REFERENCES users(id)
)
~~~~
    * change database config in ./config/db.config.js
    * run node index.js to kick off server
    * apis
        * POST users/signup
            * data: {email, password, address, phone, clinic} // clinic is the name of the clinic
        * POST users/login
            * data: {email, password}
            * response: {error, token} //token is jwt token that will be needed for querying records
        * POST records/new 
            * use bearer with jwt token as header
            * data: {doctor, patient, diagnosis, medication, fee, consultDate, consultTime, followup} // followup is boolean, fee is decimal, others are string.
            *response: HttpStatusCode
        * POST records/list
            * use bearer with jwt token as header
            * data: {refDate, mode}// refdate is the reference date to get the records, mode =0/1/2 which represents 'daily','weekly' and 'monthly' respectively.
            * response: list of consultation records
        