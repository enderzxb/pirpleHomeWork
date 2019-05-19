/*
* Create and export configuration variables.
*/


//Contariner for all the enviroments.
let enviroments = {};

//Staging (default) enviroment
enviroments.staging = {
  'httpPort' : 3000,
  'envName' : 'staging'
};

//Production enviroment.
enviroments.production = {
  'httpPort': 5000,
  'envName' : 'production'
};

//Determine whitch enviroment was passed as command-line argument
let currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//Check that the current enviroment is one of the enviroments above, if not, default to staging.
let enviromentToExport = typeof(enviroments[currentEnviroment]) == 'object' ? enviroments[currentEnviroment] : enviroments.staging;

//Export the module.
module.exports = enviromentToExport;
