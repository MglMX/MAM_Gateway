# MAM Gateway

This application allows the creation and management of Masked Authenticated Messages channels. MAM is a data communication protocol that works over IOTA's distribtued ledger which allows the emission and access of encrypted data ([more info](https://blog.iota.org/introducing-masked-authenticated-messaging-e55c1822d50e)).

The gateway allows the creation of users which can manage the channels that they have createdand restrict which other users of the application have permission to read it. It gives the possibility to specify JSON schemas that the messages of a channel must follow.

## Getting started
### Prerequisites
* NodeJS v8
* Database system (MySQL, PostgreSQL, ...)

### Installation
1. Clone the repository 
2. Install the dependencies with
` npm install`
2. Change the parameters to connect to your database in the file `config/config.json`
3. Run the server with `npm start`

### API Reference
The documentation to use the API can we found at [https://mglmx.github.io/MAM_Gateway/](https://mglmx.github.io/MAM_Gateway/).

To use the API it's necessary to register an account using the function

`POST` `/users/register`

Authorization is needed to use the functions of the API. When an account is created it is possible to log in with the following method

`POST` `/users/login`

It will return a JSON Web Token that will identify the user in the next API calls. It is necessary to add the token as a header in the request.

`{'Authorization' : 'Bearer <GIVEN_TOKEN>}`


### Wiki
Wiki pages of the project can be found at [https://github.com/mglmx/mam_gateway/wiki](https://github.com/mglmx/mam_gateway/wiki)




