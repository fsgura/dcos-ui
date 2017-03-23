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

    it('Create a simple pod', function () {
      const serviceName = 'pod-with-inline-shell-script';
      const command = 'while true ; do echo \'test\' ; sleep 100 ;';

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
      //   .type('{selectall}0.1');

      cy
        .root()
        .getFormGroupInputFor('Memory (MiB) *')
        .type('{selectall}10');

      cy
        .root()
        .getFormGroupInputFor('Memory (MiB) *')
        .type('{selectall}10');

      cy
        .root()
        .getFormGroupInputFor('Command')
        .type(command);

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
                'mem': 10
              },
              'exec': {
                'command': {
                  'shell': command
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
              'mode': 'host'
            }
          ]
        }]);

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
                'mem': 10
              },
              'exec': {
                'command': {
                  'shell': command
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
              'mode': 'host'
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
        .contains('10 MiB (10 MiB container-1)');

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
        .configurationMapValue('CPUs')
        .contains('0.1');

      cy
        .root()
        .configurationSection('Containers')
        .configurationMapValue('Container Image')
        .contains('Not Configured');

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
        .contains('10 MiB');

      cy
        .root()
        .configurationSection('Containers')
        .configurationMapValue('Command')
        .contains(command);

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
