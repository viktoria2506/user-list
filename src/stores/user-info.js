export default class UserInfo {
    constructor (name, phone, email, website,
                 city, street, suite, zipcode,
                 nameCompany, catchPhrase, bs) {
        this.name    = name;
        this.phone   = phone;
        this.email   = email;
        this.website = website;
        this.address = new Address(city, street, suite, zipcode);
        this.company = new Company(nameCompany, catchPhrase, bs);
    }
}

class Address {
    constructor (city, street, suite, zipcode) {
        this.city    = city;
        this.street  = street;
        this.suite   = suite;
        this.zipcode = zipcode;
    }
}

class Company {
    constructor (nameCompany, catchPhrase, bs) {
        this.nameCompany = nameCompany;
        this.catchPhrase = catchPhrase;
        this.bs          = bs;
    }
}
