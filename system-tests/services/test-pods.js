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

    it('Create a pod with environment variable', function () {
      const serviceName = 'pod-with-environment-variable';
      const command = '`while true ; do echo \'test\' ; sleep 100 ; done';

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
        .getFormGroupInputFor('Command')
        .type(command);

      cy
        .get('.menu-tabbed-item')
        .contains('Environment')
        .click();

      cy
        .get('.button')
        .contains('Add Environment Variable')
        .click();

      cy
        .root()
        .get('input[name="env.0.key"]')
        .type('camelCase');

      cy
        .root()
        .get('input[name="env.0.value"]')
        .type('test');

      cy
        .get('.button')
        .contains('Add Environment Variable')
        .click();

      cy
        .root()
        .get('input[name="env.1.key"]')
        .type('snake_case');

      cy
        .root()
        .get('input[name="env.1.value"]')
        .type('test');

      cy
        .get('.button')
        .contains('Add Environment Variable')
        .click();

      cy
        .root()
        .get('input[name="env.2.key"]')
        .type('lowercase');

      cy
        .root()
        .get('input[name="env.2.value"]')
        .type('test');

      cy
        .get('.button')
        .contains('Add Environment Variable')
        .click();

      cy
        .root()
        .get('input[name="env.3.key"]')
        .type('UPPERCASE');

      cy
        .root()
        .get('input[name="env.3.value"]')
        .type('test');

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
          ],
          'env': {
            'camelCase': 'test',
            'snake_case': 'test',
            'lowercase': 'test',
            'UPPERCASE': 'test'
          }
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
        .configurationMapValue('Instances')
        .contains('1');

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

      cy.viewport(1000, 2000);

      cy
        .root()
        .configurationSection('Environment Variables')
        .then(function ($envSection) {
          expect($envSection.get().length).to.equal(1);

          const $tableRows = $envSection.find('tbody tr:visible');
          const cellValues = [
            ['camelCase', 'test', 'Edit'],
            ['snake_case', 'test', 'Edit'],
            ['lowercase', 'test', 'Edit'],
            ['UPPERCASE', 'test', 'Edit']
          ];

          $tableRows.each(function (rowIndex) {
            const $tableCells = cy.$(this).find('td');

            expect($tableCells.length).to.equal(5);

            $tableCells.each(function (cellIndex) {
              expect(this.textContent.trim()).to.equal(cellValues[rowIndex][cellIndex]);
            });
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
