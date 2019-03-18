import React, { Component } from 'react';
import './App.css';

import {
  // eslint-disable-next-line
  getCustomers,
  getServices,
  // eslint-disable-next-line
  updateCustomer,
} from './api';

import AddEditCustomer from './AddEditCustomer.js';

class CustomersList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      customers: [],
      services: [],
    };
  }

  componentDidMount() {
    getServices().then(services => {
      this.setState(state => ({
        ...state,
        services,
      }));
    });

    getCustomers().then(customers => {
      this.setState(state => ({
        ...state,
        customers,
      }));
    });
  }

  renderServices = serviceIds => {
    console.log(serviceIds);
    return serviceIds
      .map(id => {
        const service = this.state.services.find(service => service.id === id);
        return service ? service.name : '';
      })
      .join(', ');
  };

  renderRow = customer => {
    return (
      <shore-table-row key={customer.id}>
        <shore-table-cell>
          {customer.name}
        </shore-table-cell>
        <shore-table-cell>
          {customer.phone}
        </shore-table-cell>
        <shore-table-cell>
          {customer.email}
        </shore-table-cell>
        <shore-table-cell>
          {this.renderServices(customer.favoriteServices)}
        </shore-table-cell>
        <shore-table-cell>
          <img
            onClick={()=>{this.props.onEditActive(customer)}}
            alt="edit" src="/pencil-edit-button.svg" className="editIcon" />
        </shore-table-cell>
      </shore-table-row>
    );
  };

  renderBody = () => {
    return (
      <shore-table-body>
        {this.state.customers.map(this.renderRow)}
      </shore-table-body>
    );
  };

  renderHeader = () => {
    return (
      <shore-table-head>
        <shore-table-row>
          <shore-table-cell>Name</shore-table-cell>
          <shore-table-cell>Phone</shore-table-cell>
          <shore-table-cell>Email</shore-table-cell>
          <shore-table-cell>Favorite Services</shore-table-cell>
          <shore-table-cell>Edit</shore-table-cell>
        </shore-table-row>
      </shore-table-head>
    );
  };

  render() {
    return (
      <shore-table>
        {this.renderHeader()}
        {this.renderBody()}
      </shore-table>
    );
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { isEditActive: false,customer:null };
  }

  /**
      @description saves customer data  in state and change edit view
  */
  onEditActive=(customer)=>{
    this.setState({customer,isEditActive:true})
  }

  render() {
    return (
      <div className="App">
        <shore-app-header
          id="shore-app-header-with-help-link"
          name="Moomin Hair Salon > Customers"
        >
          <div
            className="addCustomer"
            onClick={() => {
              this.setState({ isEditActive: !this.state.isEditActive,customer:null });
            }}
          >
            {this.state.isEditActive ? 'Cancel' : 'Add Customer'}
          </div>
        </shore-app-header>
        {this.state.isEditActive
          ? <AddEditCustomer
              onViewChange={() => {
                this.setState({ isEditActive: false });
              }}
              customer={this.state.customer}
            />
          : <CustomersList onEditActive={this.onEditActive}/>}
      </div>
    );
  }
}

export default App;
