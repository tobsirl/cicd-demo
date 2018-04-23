import React from 'react';
import './App.css';
import api from './test/stubAPI' 
import buttons from './config/buttonsConfig';
import axios from 'axios';


const host = '' ;

    class ContactForm extends React.Component {
       state = { name: '', address: '', phone_number : ''};
 
       handleSubmit = (e) => {
           e.preventDefault();
           let name = this.state.name.trim();
           let address = this.state.address.trim();
           let phone_number = this.state.phone_number.trim();
           if (!name || !address || !phone_number) {
              return;
           }
           this.props.addHandler(name,address,phone_number);
           this.setState({name: '', address: '', phone_number: ''});
        }

        handleNameChange = (e) =>  this.setState({name: e.target.value});

        handleAddressChange = (e) => this.setState({address: e.target.value});

        handlePhoneNumChange = (e) =>  this.setState({phone_number: e.target.value});

      render() {
        return (
          <div className="container-fluid">
            <div className="row">
               <div className="col-sm-2" >
                <button type="button" className="btn btn-success"
                  onClick={this.handleSubmit} >Add Contact</button>
              </div>              
              <div className="col-sm-3" >
                 <input type="text" className="form-control" 
                      placeholder="Name"
                      value={this.state.name}
                      onChange={this.handleNameChange}
                 />
              </div>
              <div className="col-sm-3" >
                 <input type="text" className="form-control"
                      placeholder="Address"
                      value={this.state.address}
                      onChange={this.handleAddressChange}
                 />
               </div>
              <div className="col-sm-2" >
                 <input type="text" className="form-control" 
                      placeholder="Phone No."
                      value={this.state.phone_number}
                      onChange={this.handlePhoneNumChange}
                 />
              </div>                             
             </div>
          </div>
          );

      }
    }

    class Contact extends React.Component {
      state = {
          status : '',
          name: this.props.contact.name,
          address: this.props.contact.address,
          phone_number: this.props.contact.phone_number
        };
       handleEdit = () =>  this.setState({ status : 'edit'} );
       handleSave = (e) =>  {
          e.preventDefault();
          let name = this.state.name.trim();
          let address = this.state.address.trim();
          let phone_number = this.state.phone_number.trim();
          if (!name || !address || !phone_number) {
             return;
          }
          this.setState({status : ''} )
          this.props.updateHandler(this.props.contact.phone_number,
                name, address, phone_number);
        };                                  
        handleCancel = () => {
            this.setState({ status : '', 
                  name: this.props.contact.name,
                  address: this.props.contact.address,
                  phone_number: this.props.contact.phone_number} ) ;
        };                
        handleNameChange = (e) =>  this.setState({name: e.target.value});

        handleAddressChange = (e) => this.setState({address: e.target.value});  
        handlePhoneNumChange = (e) =>  
                 this.setState({phone_number: e.target.value});
        handleDelete = () => {
          this.setState({ status : 'del'} )
        };      

        handleConfirm = (e) => { 
          this.props.deleteHandler(this.props.contact.phone_number) ;
        };
  
      render() {
         let activeButtons = buttons.normal ;
         let leftButtonHandler = this.handleEdit ;
         let rightButtonHandler = this.handleDelete ;
         let fields = [
                 <p key={'name'}>{this.state.name}</p>,
                 <p key={'address'} >{this.state.address}</p>,
                 <p key={'phone_number'} >{this.state.phone_number}</p>,
                ] ;
         if (this.state.status === 'del' ) {
             activeButtons = buttons.delete ;
             leftButtonHandler = this.handleCancel;
             rightButtonHandler = this.handleConfirm ;
        } else if (this.state.status === 'edit' ) {
           activeButtons = buttons.edit ;
           leftButtonHandler = this.handleSave;
           rightButtonHandler = this.handleCancel ;
           fields = [
              <input type="text" className="form-control"
                 value={this.state.name}
                 onChange={this.handleNameChange} />,
              <input type="text" className="form-control"
                 value={this.state.address}
                 onChange={this.handleAddressChange} />,
              <input type="text" className="form-control"
                 value={this.state.phone_number}
                 onChange={this.handlePhoneNumChange} />
              ] ;
           }                    
          return (
            <div className="col-sm-3" >
              <div className="panel panel-primary">
                    <div className="panel-heading">
                        { this.props.contact.name }
                    </div>
                    <div className="panel-body"> 
                      {fields}            
                    </div>
                    <div className="panel-footer"> 
                      <div className="btn-group btn-group-justified" role="group" aria-label="...">
                          <div className="btn-group" role="group">
                            <button type="button" 
                                 className={'btn ' + activeButtons.leftButtonColor} 
                                  onClick={leftButtonHandler} >
                                 {activeButtons.leftButtonVal}
                            </button>
                          </div>
                          <div className="btn-group" role="group">
                           <button type="button" 
                                 className={'btn ' + activeButtons.rightButtonColor} 
                                  onClick={rightButtonHandler} >
                                 {activeButtons.rightButtonVal}
                            </button>  
                          </div>
                      </div>                     
                    </div>          
                </div>
                </div>
               ) ; 
      }
    }

    class ContactList extends React.Component {
      render() {
         let contactRows =   this.props.contacts.map(
             (c) => 
                   <Contact key={c.phone_number} contact={c} 
                     updateHandler={this.props.updateHandler} 
                     deleteHandler={this.props.deleteHandler} /> 
            ); 
          return (
            <div className="container-fluid contacts">
              <div className="row">
                 {contactRows}  
              </div>
              </div>
            ) ;
        }
    }

   class Header extends React.Component { 
      render() {
        return (
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-3 offset-md-3" >
                  <div className="page-header">
                     <h2>Contact List <span className="badge"> {this.props.noContacts}</span>
                     </h2>
                  </div>
                </div>
              </div>
             </div>  
            ) ;
        }
    }

    class ContactsApp extends React.Component {
         async componentDidMount() {
            const resp = await axios(host + 'api/contacts');
            const contacts = await resp.data.contacts ;
            api.initialize(contacts);
            this.setState({}) ;                 
            }  

       addContact = (n, a, p) => {
          axios.post(host + 'api/contacts',
                 {name: n, phone_number: p, address: a } )
             .then ( resp => { 
                api.add(n,a,p) ;
                this.setState({});
            }) ;    
      };
      deleteContact = (key) => {
          axios.delete(host + 'api/contacts/' + key )
             .then ( resp => { 
                api.delete(key) ;
                this.setState({});
            }) ;    
      };
      updateContact = (key, n, a, p) => {
          axios.put(host + 'api/contacts'+ key,
                   {name: n, phone_number: p, address: a })
              .then( resp => { 
                 api.update(key,n,a,p); 
                 this.setState({});
              });                          
      };
      render() {
          let contacts = api.getAll() ; 
          return (
                <div className="jumbotron">
                   <Header noContacts={contacts.length}  />
                   <ContactForm  addHandler={this.addContact} />
                   <ContactList contacts={contacts} 
                    updateHandler={this.updateContact}
                    deleteHandler={this.deleteContact} />
                </div>
              
          );
      }
    }

    export default ContactsApp;