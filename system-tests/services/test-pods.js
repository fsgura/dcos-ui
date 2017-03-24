require('../_support/utils/ServicesUtil');

describe('Services', function () {

  /**
   * Test that pods work as expected
   */
  describe('Pods', function () {

    beforeEach(function () {
      cy
        .visitUrl(`services/overview/%2F${Cypress.env('TEST_UUID')}/create`);
    });

    it('Create a pod with virtual network', function () {
      const serviceName = 'pod-with-virtual-network';
      const command = 'python3 -m http.server 8080';
      const containerImage = 'python:3';

      cy
        .contains('Multi-container (Pod)')
        .click();

      cy
        .root()
        .getFormGroupInputFor('Service ID *')
        .type(`{selectall}{rightarrow}${serviceName}`);

      cy
        .get('.menu-tabbed-item')
        .contains('container-1')
        .click();

      // TODO: Due to a bug in cypress you cannot type values with dots
      // cy
      //   .root()
      //   .getFormGroupInputFor('CPUs *')
      //   .type('{selectall}0.5');

      cy
        .root()
        .getFormGroupInputFor('Memory (MiB) *')
        .type('{selectall}32');

      cy
        .root()
        .getFormGroupInputFor('Container Image')
        .type(containerImage);

      cy
        .root()
        .getFormGroupInputFor('Command')
        .type(command);

      cy
        .get('.menu-tabbed-item')
        .contains('Networking')
        .click();

      cy
        .root()
        .getFormGroupInputFor('Network Type')
        .select('Virtual Network: dcos');

      cy
        .get('.button')
        .contains('Add Service Endpoint')
        .click();

      cy
        .root()
        .getFormGroupInputFor('Container Port')
        .type('8080');

      cy
        .root()
        .getFormGroupInputFor('Service Endpoint Name')
        .type('http');

      cy
        .get('label')
        .contains('JSON Editor')
        .click();

      cy
        .get('#brace-editor')
        .contents()
        .asJson()
        .should('deep.equal', [{
          'id': `/${Cypress.env('TEST_UUID')}/${serviceName}`,
          'containers': [
            {
              'name': 'container-1',
              'resources': {
                'cpus': 0.1,
                'mem': 32
              },
              'endpoints': [
                {
                  'name': 'http',
                  'containerPort': 8080,
                  'hostPort': 0,
                  'protocol': [
                    'tcp'
                  ]
                }
              ],
              'image': {
                'id': 'python:3',
                'kind': 'DOCKER'
              },
              'exec': {
                'command': {
                  'shell': 'python3 -m http.server 8080'
                }
              }
            }
          ],
          'scaling': {
            'kind': 'fixed',
            'instances': 1
          },
          'networks': [
            {
              'name': 'dcos',
              'mode': 'container'
            }
          ]
        }]);

      cy
        .get('button')
        .contains('Review & Run')
        .click();

      cy
        .root()
        .configurationSection('General')
        .configurationMapValue('Service ID')
        .contains(`/${Cypress.env('TEST_UUID')}/${serviceName}`);

      cy
        .root()
        .configurationSection('General')
        .configurationMapValue('CPU')
        .contains('0.1 (0.1 container-1)');

      cy
        .root()
        .configurationSection('General')
        .configurationMapValue('Memory')
        .contains('32 MiB (32 MiB container-1)');

      cy
        .root()
        .configurationSection('General')
        .configurationMapValue('Disk')
        .contains('Not Supported');

      cy
        .root()
        .configurationSection('General')
        .configurationMapValue('GPU')
        .contains('Not Supported');

      cy
        .root()
        .configurationSection('Containers')
        .configurationMapValue('Container Image')
        .contains('python:3');

      cy
        .root()
        .configurationSection('Containers')
        .configurationMapValue('Force Pull On Launch')
        .contains('Not Configured');

      cy
        .root()
        .configurationSection('Containers')
        .configurationMapValue('CPUs')
        .contains('0.1');

      cy
        .root()
        .configurationSection('Containers')
        .configurationMapValue('Memory')
        .contains('32 MiB');

      cy
        .root()
        .configurationSection('Containers')
        .configurationMapValue('Command')
        .contains(command);

      cy
        .root()
        .configurationSection('Network')
        .configurationMapValue('Network Type')
        .contains('Container');

      cy
        .root()
        .configurationSection('Service Endpoints')
        .then(function ($serviceEndpointsSection) {
          const $tableRow = $serviceEndpointsSection.find('tr:visible');
          const $tableCells = $tableRow.find('td');
          const cellValues = ['http', 'tcp', '8080', 'container-1', 'Edit'];

          expect($tableCells.length).to.equal(5);

          $tableCells.each(function (index) {
            expect(this.textContent.trim()).to.equal(cellValues[index]);
          });
        });

      cy
        .get('button')
        .contains('Run Service')
        .click();

      cy
        .get('.page-body-content table')
        .contains(serviceName)
        .should('exist');

      cy
        .get('.page-body-content table')
        .getTableRowThatContains(serviceName)
        .should('exist');
    });
  });

});
