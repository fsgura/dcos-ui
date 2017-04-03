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

    it('Create a pod with artifacts', function () {
      const serviceName = 'pod-with-artifacts';
      const command = 'while true ; do echo \'test\' ; sleep 100 ; done';

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

      cy
        .root()
        .getFormGroupInputFor('Memory (MiB) *')
        .type('{selectall}10');

      cy
        .root()
        .getFormGroupInputFor('Command')
        .type(command);

      cy
        .get('.advanced-section')
        .contains('More Settings')
        .click();

      cy
        .get('.button')
        .contains('Add Artifact')
        .click();

      cy
        .get('input[name="containers.0.artifacts.0.uri"]')
        .type('http://lorempicsum.com/simpsons/600/400/1');

      cy
        .get('.button')
        .contains('Add Artifact')
        .click();

      cy
        .get('input[name="containers.0.artifacts.1.uri"]')
        .type('http://lorempicsum.com/simpsons/600/400/2');

      cy
        .get('.button')
        .contains('Add Artifact')
        .click();

      cy
        .get('input[name="containers.0.artifacts.2.uri"]')
        .type('http://lorempicsum.com/simpsons/600/400/3');

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
              },
              'artifacts': [
                {
                  'uri': 'http://lorempicsum.com/simpsons/600/400/1'
                },
                {
                  'uri': 'http://lorempicsum.com/simpsons/600/400/2'
                },
                {
                  'uri': 'http://lorempicsum.com/simpsons/600/400/3'
                }
              ]
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

      cy
        .root()
        .configurationSection('Container Artifacts')
        .then(function ($containerArtifacts) {
          // Ensure the section itself exists.
          expect($containerArtifacts.get().length).to.equal(1);

          const $tableRows = $containerArtifacts.find('tbody tr:visible');

          expect($tableRows.get().length).to.equal(3);

          const cellValues = [
            ['http://lorempicsum.com/simpsons/600/400/1', 'Edit'],
            ['http://lorempicsum.com/simpsons/600/400/2', 'Edit'],
            ['http://lorempicsum.com/simpsons/600/400/3', 'Edit']
          ];

          $tableRows.each(function (rowIndex) {
            const $tableCells = cy.$(this).find('td');

            $tableCells.each(function (cellIndex) {
              expect(this.textContent.trim()).to.equal(
                cellValues[rowIndex][cellIndex]
              );
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
