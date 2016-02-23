import _ from 'underscore';
import classNames from 'classnames';
import GeminiScrollbar from 'react-gemini-scrollbar';
import React from 'react';

import FilterByFormTab from './FilterByFormTab';
import FormPanel from './FormPanel';
import SideTabs from './SideTabs';

const METHODS_TO_BIND = ['handleFormChange', 'handleTabClick'];

class MultipleForm extends React.Component {
  constructor() {
    super();

    this.state = {
      currentTab: '',
      useGemini: false,
      model: {}
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillMount() {
    this.setState({
      currentTab: Object.keys(this.props.multipleDefinition)[0]
    });
  }

  componentDidMount() {
    this.setState({useGemini: true});
  }

  handleTabClick(tab) {
    this.setState({currentTab: tab});
  }

  handleFormChange(formData) {
    this.validateWithSchema(formData);
  }

  validateWithSchema() {
    // Nothing to do for now.
  }

  getServiceHeader() {
    return (
      <div className="media-object-spacing-wrapper">
        <div className="media-object media-object-align-middle">
          <div className="media-object-item">
            <img
              className="icon icon-sprite icon-sprite-medium
                icon-sprite-medium-color"
              src={this.props.serviceImage} />
          </div>
          <div className="media-object-item">
            <h4 className="flush-top flush-bottom text-color-neutral">
              {this.props.serviceName}
            </h4>
            <span className="side-panel-resource-label">
              {this.props.serviceVersion}
            </span>
          </div>
        </div>
      </div>
    );
  }

  getSideTabs(multipleDefinition) {
    let tabValues = _.values(multipleDefinition);
    let content = null;

    if (this.props.isMobileWidth) {
      content = (
        <FilterByFormTab
          currentTab={this.state.currentTab}
          handleFilterChange={this.handleTabClick}
          tabs={tabValues} />
      );
    } else {
      content = (
        <SideTabs
          onTabClick={this.handleTabClick}
          selectedTab={this.state.currentTab}
          tabs={tabValues} />
      );
    }

    let isMobileWidth = this.props.isMobileWidth;
    let classSet = classNames({
      'column-4': !isMobileWidth,
      'column-12': isMobileWidth
    });

    if (this.state.useGemini && !isMobileWidth) {
      return (
        <GeminiScrollbar autoshow={true} className={classSet}>
          <div className="multiple-form-left-column">
            {this.getServiceHeader()}
            {content}
          </div>
        </GeminiScrollbar>
      );
    }

    return (
      <div className={classSet}>
        {this.getServiceHeader()}
        {content}
      </div>
    );
  }

  getFormPanel(selectedTabDefinition) {
    let panel = (
      <FormPanel
        definition={this.props.multipleDefinition}
        description={selectedTabDefinition.description}
        title={selectedTabDefinition.title}
        currentTab={this.state.currentTab} />
    );

    let isMobileWidth = this.props.isMobileWidth;
    let classSet = classNames({
      'column-8 multiple-form-right-column': !isMobileWidth,
      'column-12': isMobileWidth
    });

    if (this.state.useGemini && !isMobileWidth) {
      return (
        <GeminiScrollbar autoshow={true} className={classSet}>
          {panel}
        </GeminiScrollbar>
      );
    }

    return (
      <div className={classSet}>
        {panel}
      </div>
    );
  }

  render() {
    let multipleDefinition = this.props.multipleDefinition;
    let selectedTabDefinition = multipleDefinition[this.state.currentTab];
    if (!selectedTabDefinition) {
      selectedTabDefinition = {};
    }

    let isMobileWidth = this.props.isMobileWidth;
    let classSet = classNames('row row-flex multiple-form', {
       'mobile-width': isMobileWidth
    });

    return (
      <div className={classSet}>
        {this.getSideTabs(multipleDefinition)}
        {this.getFormPanel(selectedTabDefinition)}
      </div>
    );
  }
}

MultipleForm.defaultProps = {
  multipleDefinition: {},
  serviceImage: './img/services/icon-service-marathon-large@2x.png',
  serviceName: 'Marathon',
  serviceVersion: '0.23.2'
};

MultipleForm.propTypes = {
  isMobileWidth: React.PropTypes.bool,
  multipleDefinition: React.PropTypes.object,
  serviceImage: React.PropTypes.string,
  serviceName: React.PropTypes.string,
  serviceVersion: React.PropTypes.string
};

module.exports = MultipleForm;
