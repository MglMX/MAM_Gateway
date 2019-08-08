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

### Wiki
Wiki pages of the project can be found at




