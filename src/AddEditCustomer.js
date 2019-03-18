import React from 'react';
import './AddEditCustomer.css';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';

import {
  // eslint-disable-next-line
  createCustomer,
  getServices,
  // eslint-disable-next-line
  updateCustomer,
} from './api';

class AddEditCustomer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      customers: [],
      services: [],
      submitType:this.props.customer?'Update':'Add Customer',
      customerInfo: this.props.customer?this.props.customer:{
        name: '',
        email: '',
        phone: '',
        favoriteServices: [],
      },
      validationErrors: {
        name: null,
        email: null,
        phone: null,
        favoriteServices: null,
      },
      servicesDropDownData: [],
      defaultDropDownData:[],
    };
  }

  componentDidMount() {
    getServices().then(services => {
      const servicesDropDownData = [];
      const selectedValue=this.props.customer?this.props.customer.favoriteServices:[];
      const defaultDropDownData = [];

      services.forEach(service => {
        const itemService = service;
        itemService.label = service.name;
        itemService.value = service.id;
        servicesDropDownData.push(itemService);
        if(selectedValue.includes(service.id)){
          defaultDropDownData.push({label:service.name,value:service.id});
        }
      });
      console.log(defaultDropDownData);
      this.setState(state => ({
        ...state,
        services,
        servicesDropDownData,
        defaultDropDownData
      }));
    });
  }

  /**
      @description handles on input change
  */
  handleInputChange = (e, field) => {
    const validationErrors = this.state.validationErrors;
    const customerInfo = this.state.customerInfo;

    const value = e.target.value;
    if (value) {
      if (field !== 'name') {
        if (this.validationFeilds(value, field)) {
          validationErrors[field] = null;
        } else {
          validationErrors[field] = `Not vaild ${field} `;
        }
      } else {
        validationErrors[field] = null;
      }

      customerInfo[field] = value;
    } else {
      customerInfo[field] = '';
      validationErrors[field] = 'field is empty';
    }
    this.setState({ customerInfo, validationErrors });
  };

  /**
      @description validates email/phone data
  */
  validationFeilds = (value, field) => {
    let regex = null;
    if (field === 'email') {
    regex=/\S+@\S+\.\S+/; //eslint-disable-line
    } else if (field === 'phone') {
      regex = /^\d{10}$/;
    }
    if (regex.test(value)) {
      return true;
    }
    return false;
  };

  /**
      @description handle submit/update button and validates data and save in db
  */
  onSubmitData = () => {
    console.log('validate');
    if (this.validateData()) {
      if(this.state.submitType==='Update'){
        console.log(this.state.customerInfo);
        updateCustomer(this.state.customerInfo.id,this.state.customerInfo)
      }else {
        createCustomer(this.state.customerInfo)
      }
      console.log(this.state.customerInfo);
      this.props.onViewChange();
    }
  };

  /**
      @description Validates all feilds
  */
  validateData = () => {
    let hasData = true;
    const customerInfo = this.state.customerInfo;
    const validationErrors = this.state.validationErrors;
    ['name', 'phone', 'email', 'favoriteServices'].forEach(field => {
      const value = customerInfo[field];
      if (!value || (value && value.length <= 0)) {
        hasData = false;
        validationErrors[field] = 'Feild is empty';
      } else if (
        ['phone', 'email'].includes(field) &&
        !this.validationFeilds(value, field)
      ) {
        hasData = false;
        validationErrors[field] = `Not vaild ${field} `;
      }
    });
    this.setState({ validationErrors });
    return hasData;
  };

  /**
      @description handles dropdown change and save selected data to state
  */
  handleDropdown = data => {
    console.log(data);
    const validationErrors = this.state.validationErrors;
    const customerInfo = this.state.customerInfo;
    if (data && data.length > 0) {
      validationErrors.favoriteServices = null;
    } else {
      validationErrors.favoriteServices = 'Select atleat one service';
    }
    const services=[];
    data.map(service=>services.push(service.value))
    console.log(services);
    customerInfo.favoriteServices = services;
    this.setState({ validationErrors, customerInfo });
  };

  render() {
    return (
      <div className="Container">
        <div className="content">
          <div className="headerText">Add Customer</div>
          {['name', 'phone', 'email'].map(field =>
            <div className="fieldContainer">
              <div className="fieldHolder">
                <div className="inputText">
                  {field}
                </div>
                <div>
                  <input
                    type="text"
                    value={this.state.customerInfo[field]}
                    onChange={e => {
                      this.handleInputChange(e, field);
                    }}
                  />
                </div>
              </div>
              <div className="errorMessage">
                {this.state.validationErrors[field]}
              </div>
            </div>,
          )}
          <div className="fieldContainer">
            <div className="fieldHolder">
              <div className="inputText">Service</div>
            {this.state.servicesDropDownData&&this.state.servicesDropDownData.length>0?  <Select
                className="dropDown"
                closeMenuOnSelect={false}
                components={makeAnimated()}
                defaultValue={this.state.defaultDropDownData}
                onChange={this.handleDropdown}
                isMulti
                options={this.state.servicesDropDownData}
              />:null}
            </div>
            <div className="errorMessage">
              {this.state.validationErrors.favoriteServices}
            </div>
          </div>
          <button className="button" onClick={() => this.onSubmitData()}>
            {this.state.submitType}
          </button>
        </div>
      </div>
    );
  }
}

export default AddEditCustomer;
