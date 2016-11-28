import React, {Component, PropTypes} from 'react';

import Application from '../../structs/Application';
import Pod from '../../structs/Pod';

import {NEW_APP_DEFAULTS} from '../../constants/NewApplicationDefaults';
import {NEW_POD_DEFAULTS} from '../../constants/NewPodDefaults';

import FullScreenModal from '../../../../../../src/js/components/modals/FullScreenModal';
import FullScreenModalHeader from '../../../../../../src/js/components/modals/FullScreenModalHeader';
import FullScreenModalHeaderActions from '../../../../../../src/js/components/modals/FullScreenModalHeaderActions';
import FullScreenModalHeaderTitle from '../../../../../../src/js/components/modals/FullScreenModalHeaderTitle';
import NewCreateServiceModalServicePicker from './NewCreateServiceModalServicePicker';
import NewCreateServiceModalForm from './NewCreateServiceModalForm';
import CreateServiceJsonOnly from './CreateServiceJsonOnly';
import Service from '../../structs/Service';
import ServiceConfigDisplay from '../../service-configuration/ServiceConfigDisplay';
import ToggleButton from '../../../../../../src/js/components/ToggleButton';
import Util from '../../../../../../src/js/utils/Util';

const METHODS_TO_BIND = [
  'handleGoBack',
  'handleClose',
  'handleConvertToPod',
  'handleJSONToggle',
  'handleServiceChange',
  'handleServiceErrorChange',
  'handleServiceReview',
  'handleServiceRun',
  'handleServiceSelection'
];

class NewServiceFormModal extends Component {
  constructor() {
    super(...arguments);

    this.state = this.getResetState();

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  /**
   * @override
   */
  componentWillUpdate(nextProps) {
    const requestCompleted = this.props.isPending && !nextProps.isPending;
    const shouldClose = requestCompleted && !nextProps.errors;

    if (shouldClose) {
      this.handleClose();
    }
  }

  handleGoBack() {
    let {
      serviceFormActive,
      serviceJsonActive,
      servicePickerActive,
      serviceReviewActive
    } = this.state;

    // Close if picker is open, or if editing a service in the form
    if (servicePickerActive || (serviceFormActive && this.props.isEdit)) {
      this.handleClose();
      return;
    }

    if (serviceReviewActive) {
      // Just hide review screen. Form or JSON mode will be
      // activated automaticaly depending on their last state
      this.setState({
        serviceReviewActive: false
      });
      return;
    }

    if (serviceFormActive) {
      // Switch back from form to picker
      this.setState({
        servicePickerActive: true,
        serviceFormActive: false
      });
      return;
    }

    if (serviceJsonActive) {
      // Switch back from JSON to picker
      this.setState({
        servicePickerActive: true,
        serviceJsonActive: false
      });
      return;
    }
  }

  handleClose() {
    this.props.onClose();
    this.setState(this.getResetState());
  }

  handleConvertToPod() {
    this.handleServiceSelection({type:'pod'});
  }

  handleJSONToggle() {
    this.setState({isJSONModeActive: !this.state.isJSONModeActive});
  }

  getResetState(nextProps = this.props) {
    let newState = {
      isJSONModeActive: false,
      serviceConfig: nextProps.service,
      serviceFormActive: false,
      serviceJsonActive: false,
      servicePickerActive: true,
      serviceReviewActive: false,
      serviceFormHasErrors: false
    };

    // Switch directly to form if edit
    if (nextProps.isEdit) {
      newState.servicePickerActive = false;
      newState.serviceFormActive = true;
    }

    return newState;
  }

  handleServiceChange(newService) {
    this.setState({
      serviceConfig: newService
    });
  }

  handleServiceErrorChange(hasErrors) {
    this.setState({
      serviceFormHasErrors: hasErrors
    });
  }

  handleServiceSelection({type}) {
    switch (type) {

      case 'app':
        this.setState({
          servicePickerActive: false,
          serviceFormActive: true,
          serviceConfig: new Application(
            Object.assign(
              {id: this.props.service.id},
              NEW_APP_DEFAULTS
            )
          )
        });
        break;

      case 'pod':
        this.setState({
          servicePickerActive: false,
          serviceFormActive: true,
          serviceConfig: new Pod(
            Object.assign(
              {id: this.props.service.id},
              NEW_POD_DEFAULTS
            )
          )
        });
        break;

      case 'json':
        this.setState({
          servicePickerActive: false,
          serviceJsonActive: true,
          serviceConfig: this.props.service
        });
        break;

    };
  }

  handleServiceReview() {
    this.setState({
      serviceReviewActive: true
    });
  }

  handleServiceRun() {
    let {marathonAction, service} = this.props;
    marathonAction(
      service,
      this.state.serviceConfig
    );
  }

  getHeader() {

    // NOTE: Always prioritize review screen check
    if (this.state.serviceReviewActive) {
      return (
        <FullScreenModalHeader>
          <FullScreenModalHeaderActions
            actions={this.getSecondaryActions()}
            type="secondary" />
          <FullScreenModalHeaderTitle>
            Review & Run Service
          </FullScreenModalHeaderTitle>
          <FullScreenModalHeaderActions
            actions={this.getPrimaryActions()}
            type="primary" />
        </FullScreenModalHeader>
      );
    }

    let title = 'Run a Service';
    let {isEdit, service} = this.props;
    let serviceName = service.getName();
    if (serviceName) {
      serviceName = `"${serviceName}"`;
    } else {
      serviceName = 'Service';
    }

    if (isEdit) {
      title = `Edit ${serviceName}`;
    }

    return (
      <FullScreenModalHeader>
        <FullScreenModalHeaderActions
          actions={this.getSecondaryActions()}
          type="secondary" />
        <FullScreenModalHeaderTitle>
          {title}
        </FullScreenModalHeaderTitle>
        <FullScreenModalHeaderActions
          actions={this.getPrimaryActions()}
          type="primary" />
      </FullScreenModalHeader>
    );
  }

  getModalContent() {
    let {
      isJSONModeActive,
      serviceConfig,
      serviceFormActive,
      serviceJsonActive,
      servicePickerActive,
      serviceReviewActive
    } = this.state;

    // NOTE: Always prioritize review screen check
    if (serviceReviewActive) {
      return (
        <ServiceConfigDisplay appConfig={serviceConfig} />
      );
    }

    if (servicePickerActive) {
      return (
        <NewCreateServiceModalServicePicker
          onServiceSelect={this.handleServiceSelection} />
      );
    }

    if (serviceFormActive) {
      let {isEdit} = this.props;

      return (
        <NewCreateServiceModalForm
          isJSONModeActive={isJSONModeActive}
          service={serviceConfig}
          onChange={this.handleServiceChange}
          onConvertToPod={this.handleConvertToPod}
          onErrorStateChange={this.handleServiceErrorChange}
          isEdit={isEdit}/>
      );
    }

    if (serviceJsonActive) {
      return (
        <CreateServiceJsonOnly
          service={serviceConfig}
          onChange={this.handleServiceChange}
          onErrorStateChange={this.handleServiceErrorChange} />
      );
    }

    return null;
  }

  getPrimaryActions() {
    let {
      serviceFormActive,
      serviceJsonActive,
      servicePickerActive,
      serviceReviewActive
    } = this.state;

    // NOTE: Always prioritize review screen check
    if (serviceReviewActive) {
      return [
        {
          className: 'button-primary flush-vertical',
          clickHandler: this.handleServiceRun,
          label: 'Run Service'
        }
      ];
    }

    if (servicePickerActive) {
      return null;
    }

    if (serviceFormActive) {
      return [
        {
          node: (
            <ToggleButton
              className="flush"
              checkboxClassName="toggle-button"
              checked={this.state.isJSONModeActive}
              onChange={this.handleJSONToggle}
              key="json-editor">
              JSON Editor
            </ToggleButton>
          )
        },
        {
          className: 'button-primary flush-vertical',
          clickHandler: this.handleServiceReview,
          disabled: this.state.serviceFormHasErrors,
          label: 'Review & Run'
        }
      ];
    }

    if (serviceJsonActive) {
      return [
        {
          className: 'button-primary flush-vertical',
          clickHandler: this.handleServiceReview,
          disabled: this.state.serviceFormHasErrors,
          label: 'Review & Run'
        }
      ];
    }

    return [];
  }

  getSecondaryActions() {
    let {servicePickerActive, serviceFormActive} = this.state;
    let label = 'Back';
    if (servicePickerActive || (serviceFormActive && this.props.isEdit)) {
      label = 'Cancel';
    }

    return [
      {
        className: 'button-stroke',
        clickHandler: this.handleGoBack,
        label
      }
    ];
  }

  render() {
    let {props} = this;

    return (
      <FullScreenModal
        header={this.getHeader()}
        onClose={this.handleClose}
        {...Util.omit(props, Object.keys(NewServiceFormModal.propTypes))}>
        {this.getModalContent()}
      </FullScreenModal>
    );
  }
}

NewServiceFormModal.propTypes = {
  errors: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  isEdit: PropTypes.bool,
  isPending: PropTypes.bool.isRequired,
  marathonAction: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  service: PropTypes.instanceOf(Service).isRequired
};

module.exports = NewServiceFormModal;
