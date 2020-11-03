export default class UserInfo {
    constructor (userInfo = {}, addressInfo ={}, companyInfo={}) {
        this.id      = userInfo.id || '';
        this.name    = userInfo.name || '';
        this.phone   = userInfo.phone || '';
        this.email   = userInfo.email || '';
        this.website = userInfo.website || '';


        this.address = new Address(
            addressInfo.city, addressInfo.street,
            addressInfo.suite, addressInfo.zipcode
        );
        this.company = new Company(
            companyInfo.name,
            companyInfo.catchPhrase,
            companyInfo.bs
        );
    }

   /* isAddressEmpty = () => {
        return !this.address.city && !this.address.street &&
            !this.address.suite && !this.address.zipcode
    }*/
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
    constructor (name, catchPhrase, bs) {
        this.name        = name;
        this.catchPhrase = catchPhrase;
        this.bs          = bs;
    }
}
