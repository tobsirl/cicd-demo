import _ from 'lodash';

class StubAPI {

    constructor() {
        this.contacts = [ ] ; 
    }

      initialize(contacts) {    // NEW 
          this.contacts = contacts
          return null; 
      }
    delete(k) {
        let elements = _.remove(this.contacts, 
            (contact) => contact.phone_number === k
        );
        return elements; 
    }
    getAll() {
        return this.contacts ;
    }

    add(n,a,p) {
        let len = this.contacts.length ;
        let newLen = this.contacts.push({
            name: n, address : a, phone_number: p }) ;
        return newLen > len ;
    }

    update(key,n,a,p) {
        let index = _.findIndex(this.contacts, 
            (contact) => contact.phone_number === key
        );      
        if (index !== -1) {
            this.contacts.splice(index, 1, 
                {name: n, address: a, phone_number: p});
            return true ;
        }
        return false ;
    }
}

export default (new StubAPI() );