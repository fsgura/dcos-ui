import classNames from 'classnames';
import {Confirm, Table} from 'reactjs-components';
import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {StoreMixin} from 'mesosphere-shared-reactjs';

import CosmosPackagesStore from '../stores/CosmosPackagesStore';
import RepositoriesTableHeaderLabels from '../constants/RepositoriesTableHeaderLabels';
import ResourceTableUtil from '../utils/ResourceTableUtil';
import List from '../structs/List';

const METHODS_TO_BIND = [
  'getHeadline',
  'getUninstallButton',
  'handleOpenConfirm',
  'handleDeleteCancel',
  'handleDeleteRepository'
];

class RepositoriesTable extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      repositoryToUninstall: null,
      repositoryUninstallError: null,
      pendingRequest: false
    };

    this.store_listeners = [{
      name: 'cosmosPackages',
      events: ['repositoryDeleteError', 'repositoryDeleteSuccess'],
      unmountWhen: function () {
        return true;
      },
      listenAlways: true
    }];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  onCosmosPackagesStoreRepositoryDeleteError(error) {
    this.setState({repositoryUninstallError: error, pendingRequest: false});
  }

  onCosmosPackagesStoreRepositoryDeleteSuccess() {
    this.setState({
      repositoryToUninstall: null,
      repositoryUninstallError: null,
      pendingRequest: false
    });
    CosmosPackagesStore.fetchRepositories();
  }

  handleOpenConfirm(repositoryToUninstall) {
    this.setState({repositoryToUninstall});
  }

  handleDeleteCancel() {
    this.setState({repositoryToUninstall: null});
  }

  handleDeleteRepository() {
    let {repositoryToUninstall} = this.state;
    CosmosPackagesStore.deleteRepository(
      repositoryToUninstall.get('name'),
      repositoryToUninstall.get('url')
    );

    this.setState({pendingRequest: true});
  }

  getClassName(prop, sortBy, row) {
    return classNames({
      'highlight': prop === sortBy.prop,
      'clickable': row == null // this is a header
    });
  }

  getColumns() {
    let getClassName = this.getClassName;
    let heading = ResourceTableUtil
      .renderHeading(RepositoriesTableHeaderLabels);
    let sortFunction = ResourceTableUtil
      .getStatSortFunction('name', function (repository, prop) {
        return repository.get(prop);
      });

    return [
      {
        className: getClassName,
        headerClassName: getClassName,
        heading,
        prop: 'name',
        render: this.getHeadline,
        sortable: true,
        sortFunction
      },
      {
        className: getClassName,
        headerClassName: getClassName,
        heading,
        prop: 'uri',
        render: this.getUri,
        sortable: true,
        sortFunction
      },
      {
        className: getClassName,
        headerClassName: getClassName,
        heading: function () {},
        prop: 'uninstall',
        render: this.getUninstallButton,
        sortable: false
      }
    ];
  }

  getColGroup() {
    return (
      <colgroup>
        <col />
        <col style={{width: '320px'}} />
        <col style={{width: '120px'}} />
      </colgroup>
    );
  }

  getUri(prop, repository) {
    return repository.get('uri');
  }

  getHeadline(prop, repository) {
    return (
      <div className="flex-box flex-box-align-vertical-center table-cell-flex-box">
        <span className="text-overflow">
          {repository.get('name')}
        </span>
      </div>
    );
  }

  getUninstallButton(prop, repositoryToUninstall) {
    return (
      <div className="flex-align-right">
        <a
          className="button button-link button-danger table-display-on-row-hover"
          onClick={this.handleOpenConfirm.bind(this, repositoryToUninstall)}>
          Uninstall
        </a>
      </div>
    );
  }

  getUninstallModalContent() {
    let {repositoryUninstallError, repositoryToUninstall} = this.state;
    let repositoryLabel = 'This repository';
    if (repositoryToUninstall) {
      repositoryLabel = repositoryToUninstall.get('name');
    }

    let error = null;

    if (repositoryUninstallError != null) {
      error = (
        <p className="text-error-state">{repositoryUninstallError}</p>
      );
    }

    return (
      <div className="container-pod container-pod-short text-align-center">
        <h3 className="flush-top">Are you sure?</h3>
        <p>
          {`${repositoryLabel} will be uninstalled from DCOS. You will not be able to install any packages belonging to that repository anymore.`}
        </p>
        {error}
      </div>
    );
  }

  render() {
    return (
      <div>
        <Table
          className="table inverse table-borderless-outer table-borderless-inner-columns flush-bottom"
          columns={this.getColumns()}
          colGroup={this.getColGroup()}
          data={this.props.repositories.getItems().slice()}
          sortBy={{prop: 'name', order: 'desc'}} />
        <Confirm
          closeByBackdropClick={true}
          disabled={this.state.pendingRequest}
          footerContainerClass="container container-pod container-pod-short
            container-pod-fluid flush-top flush-bottom"
          open={!!this.state.repositoryToUninstall}
          onClose={this.handleDeleteCancel}
          leftButtonCallback={this.handleDeleteCancel}
          rightButtonCallback={this.handleDeleteRepository}
          rightButtonClassName="button button-danger"
          rightButtonText="Uninstall">
          {this.getUninstallModalContent()}
        </Confirm>
      </div>
    );
  }
}

RepositoriesTable.defaultProps = {
  repositories: new List()
};

RepositoriesTable.propTypes = {
  repositories: React.PropTypes.object.isRequired
};

module.exports = RepositoriesTable;
